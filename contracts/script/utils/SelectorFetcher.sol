// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import {StringUtils} from "./StringUtils.sol";

/// @title SelectorFetcher
/// @author Ralph Schuler
/// @notice Utility contract for fetching and decoding function selectors
///         from compiled facet contracts using Foundry's `forge selectors list`.
/// @dev Relies on Foundry's ffi to execute shell commands and extract selectors.
abstract contract SelectorFetcher is Script {
    using StringUtils for string;

    /// @notice Resolve all function selectors for a given fully-qualified contract name (FQCN).
    /// @param fqcn The fully-qualified contract name (e.g., "FeatureOneFacet").
    /// @return selectors An array of function selectors (bytes4) parsed from the forge output.
    function selectorsFor(
        string memory fqcn
    ) internal returns (bytes4[] memory selectors) {
        string[] memory cmd = new string[](3);
        cmd[0] = "bash";
        cmd[1] = "-lc";
        // Add a "SELECTOR:" prefix to each line to force string output from ffi
        cmd[2] = string(
            abi.encodePacked(
                "forge selectors list ",
                fqcn,
                " | awk -F'|' '/Function/ {gsub(/ /, \"\", $4); printf \"SELECTOR:%s\\n\", $4}'"
            )
        );
        bytes memory out = vm.ffi(cmd);
        string[] memory lines = StringUtils.splitLines(string(out));
        uint256 n = 0;
        for (uint256 i = 0; i < lines.length; i++) {
            // Count valid selector lines
            if (bytes(lines[i]).length > 9 && bytes(lines[i])[0] == "S") {
                n++;
            }
        }
        selectors = new bytes4[](n);
        uint256 k = 0;
        for (uint256 i = 0; i < lines.length; i++) {
            string memory line = lines[i];
            if (bytes(line).length > 9 && bytes(line)[0] == "S") {
                selectors[k++] = hexStringToBytes4(
                    substring(line, 9, bytes(line).length)
                );
            }
        }
    }

    /// @notice Convert a hex string into a bytes4 selector.
    /// @param s The string in hex format (must be "0x" followed by 8 hex chars).
    /// @return r The parsed bytes4 value.
    function hexStringToBytes4(
        string memory s
    ) internal pure returns (bytes4 r) {
        bytes memory b = bytes(s);
        require(b.length == 10 && b[0] == "0" && b[1] == "x", "hex4");
        uint32 val = 0;
        for (uint256 i = 2; i < 10; i += 2) {
            uint8 hi = fromHex(b[i]);
            uint8 lo = fromHex(b[i + 1]);
            val = (val << 8) | uint32((hi << 4) | lo);
        }
        r = bytes4(bytes32(uint256(val) << 224));
    }

    /// @notice Decode a single hex character into its numeric value.
    /// @param c The hex character as a byte.
    /// @return The numeric value of the hex digit (0–15).
    function fromHex(bytes1 c) internal pure returns (uint8) {
        if (c >= 0x30 && c <= 0x39) return uint8(c) - 48; // '0'-'9'
        if (c >= 0x61 && c <= 0x66) return 10 + uint8(c) - 97; // 'a'-'f'
        if (c >= 0x41 && c <= 0x46) return 10 + uint8(c) - 65; // 'A'-'F'
        revert("bad hex");
    }

    /// @notice Extract a substring from a string by index range.
    /// @param str The original string.
    /// @param startIndex The starting index (inclusive).
    /// @param endIndex The ending index (exclusive).
    /// @return A new string containing characters from `startIndex` to `endIndex - 1`.
    function substring(
        string memory str,
        uint256 startIndex,
        uint256 endIndex
    ) internal pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        require(startIndex < endIndex, "substring: invalid indexes");
        require(endIndex <= strBytes.length, "substring: out of bounds");
        bytes memory result = new bytes(endIndex - startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = strBytes[i];
        }
        return string(result);
    }
}
