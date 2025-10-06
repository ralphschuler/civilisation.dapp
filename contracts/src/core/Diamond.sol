// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {DiamondCutLib, DiamondCutStorage, FacetCut} from "./protocols/DiamondCut/DiamondCutLib.sol";
import {ERC173Lib} from "./protocols/ERC173/ERC173Lib.sol";
import {ByteHasher} from "../utilities/ByteHasher.sol";
import {IWorldID} from "../interfaces/IWorldID.sol";

using ByteHasher for bytes;

/// @notice Thrown when a function selector does not match any facet in the diamond.
/// @param _functionSelector The selector that was not found.
error FunctionNotFound(bytes4 _functionSelector);

/// @notice Thrown when a write action is attempted without a queued World ID proof.
/// @param account The caller missing a valid proof.
error MissingWorldIdProof(address account);

/// @notice Thrown when a caller without sufficient privileges attempts a restricted action.
/// @param caller The unauthorized caller.
error Unauthorized(address caller);

/// @notice Thrown when the World ID verifier rejects a reused nullifier hash.
/// @param nullifierHash The duplicated nullifier hash.
error DuplicateNullifier(uint256 nullifierHash);

/// @notice Thrown when the contract is asked to enforce World ID checking without a configured verifier.
error WorldIdNotConfigured();

/// @notice Arguments used during diamond deployment.
/// @dev Passed to the constructor to initialize facets and run optional setup.
/// @param init The address of a contract/facet to call during initialization
/// @param initCalldata Calldata to pass to the initializer contract
/// @param worldId The World ID router/verifier contract
/// @param worldIdAppId The registered World ID application identifier
/// @param worldIdActionId The World ID action identifier guarding write actions
/// @param worldIdGroupId The Semaphore group identifier (defaults to 1 when zero)
struct DiamondArgs {
	address init;
	bytes initCalldata;
	IWorldID worldId;
	string worldIdAppId;
	string worldIdActionId;
	uint256 worldIdGroupId;
}

/// @title Diamond Proxy Contract
/// @notice Implements the core diamond proxy pattern (EIP-2535).
/// @dev Forwards calls to facets based on function selector lookups.
///      Uses `delegatecall` to preserve storage and context.
contract Diamond {
	/// @notice Emitted when a selector has its write-action status updated.
	/// @param selector The function selector being configured.
	/// @param isWriteAction Whether the selector now requires a World ID proof.
	event WriteActionConfigured(bytes4 indexed selector, bool isWriteAction);

	/// @notice Emitted when a caller successfully queues a write action with a verified proof.
	/// @param account The caller that provided the proof.
	/// @param nullifierHash The nullifier hash associated with the proof.
	event WriteActionQueued(address indexed account, uint256 nullifierHash);

	/// @dev Immutable reference to the World ID verifier contract.
	IWorldID public immutable worldId;

	/// @dev External nullifier derived from the configured app & action identifiers.
	uint256 public immutable worldIdExternalNullifier;

	/// @dev World ID group identifier (defaults to Semaphore group 1).
	uint256 public immutable worldIdGroupId;

	/// @dev Tracks consumed nullifier hashes to prevent proof reuse.
	mapping(uint256 => bool) private nullifierHashes;

	/// @dev Tracks callers that have provided a valid proof and may execute the next write action.
	mapping(address => bool) private pendingWriteProof;

	/// @dev Stores which selectors represent World ID-protected write actions.
	mapping(bytes4 => bool) private writeActionSelectors;

	/// @notice Deploys a new diamond and executes the initial diamond cut.
	/// @param diamondCut Initial facet cut definitions (facets + selectors).
	/// @param args Initialization arguments (optional init call).
	constructor(FacetCut[] memory diamondCut, DiamondArgs memory args) payable {
		worldId = args.worldId;
		if (address(args.worldId) != address(0)) {
			uint256 appIdHash = abi.encodePacked(args.worldIdAppId).hashToField();
			worldIdExternalNullifier = abi.encodePacked(appIdHash, args.worldIdActionId).hashToField();
		} else {
			worldIdExternalNullifier = 0;
		}
		worldIdGroupId = args.worldIdGroupId == 0 ? 1 : args.worldIdGroupId;
		DiamondCutLib.diamondCut(diamondCut, args.init, args.initCalldata);
	}

	/// @notice Fallback that routes calls to the appropriate facet.
	/// @dev Uses selector-to-facet mapping in `DiamondCutStorage`.
	///      Reverts with `FunctionNotFound` if selector is not registered.
	fallback() external payable {
		if (writeActionSelectors[msg.sig]) {
			if (address(worldId) == address(0)) revert WorldIdNotConfigured();
			if (!pendingWriteProof[msg.sender]) revert MissingWorldIdProof(msg.sender);
			pendingWriteProof[msg.sender] = false;
		}

		DiamondCutStorage storage ds;
		bytes32 position = DiamondCutLib.DIAMOND_CUT_STORAGE_POSITION;
		// get diamond storage
		assembly {
			ds.slot := position
		}

		// lookup facet for this selector
		address facet = ds.facetAddressAndSelectorPosition[msg.sig].facetAddress;
		if (facet == address(0)) {
			revert FunctionNotFound(msg.sig);
		}

		// Delegatecall into the facet
		assembly {
			// copy calldata
			calldatacopy(0, 0, calldatasize())

			// delegatecall into facet
			let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)

			// copy returndata
			returndatacopy(0, 0, returndatasize())

			// bubble result
			switch result
			case 0 {
				revert(0, returndatasize())
			}
			default {
				return(0, returndatasize())
			}
		}
	}

	/// @notice Receive function for plain ETH transfers.
	/// @dev Required so the diamond can accept ETH.
	receive() external payable {}

	/// @notice Mark selectors as write actions requiring a prior World ID proof.
	/// @param selectors The function selectors to configure.
	/// @param isWriteAction Whether the selectors should be treated as write actions.
	function configureWriteActions(bytes4[] calldata selectors, bool isWriteAction) external {
		if (msg.sender != ERC173Lib.s().owner) revert Unauthorized(msg.sender);
		for (uint256 i; i < selectors.length; i++) {
			writeActionSelectors[selectors[i]] = isWriteAction;
			emit WriteActionConfigured(selectors[i], isWriteAction);
		}
	}

	/// @notice Returns whether a selector is currently treated as a write action.
	/// @param selector The selector to query.
	function isWriteAction(bytes4 selector) external view returns (bool) {
		return writeActionSelectors[selector];
	}

	/// @notice Returns whether an account has a pending, unconsumed proof.
	/// @param account The account to query.
	function hasPendingWriteProof(address account) external view returns (bool) {
		return pendingWriteProof[account];
	}

	/// @notice Provide and verify a World ID proof, enabling the next write action for the caller.
	/// @param root The Merkle tree root returned by the World ID widget.
	/// @param nullifierHash The proof nullifier, preventing double signalling.
	/// @param proof The zero-knowledge proof attesting to membership.
	function verifyWorldIdAndQueueWrite(
		uint256 root,
		uint256 nullifierHash,
		uint256[8] calldata proof
	) external {
		if (address(worldId) == address(0)) revert WorldIdNotConfigured();
		if (nullifierHashes[nullifierHash]) revert DuplicateNullifier(nullifierHash);

		worldId.verifyProof(
			root,
			worldIdGroupId,
			abi.encodePacked(msg.sender).hashToField(),
			nullifierHash,
			worldIdExternalNullifier,
			proof
		);

		nullifierHashes[nullifierHash] = true;
		pendingWriteProof[msg.sender] = true;
		emit WriteActionQueued(msg.sender, nullifierHash);
	}
}
