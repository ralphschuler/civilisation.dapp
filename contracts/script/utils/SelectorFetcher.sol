pragma solidity ^0.8.30;

import "forge-std/Script.sol";

abstract contract SelectorFetcher is Script {
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
        string[] memory lines = vm.split(string(out), "\n");
        uint256 n = 0;
        for (uint256 i = 0; i < lines.length; i++) {
            // Check for our prefix to count valid lines
            if (bytes(lines[i]).length > 9 && bytes(lines[i])[0] == "S") {
                n++;
            }
        }
        selectors = new bytes4[](n);
        uint256 k = 0;
        for (uint256 i = 0; i < lines.length; i++) {
            string memory line = lines[i];
            // Check for prefix, remove it, then parse the hex string
            if (bytes(line).length > 9 && bytes(line)[0] == "S") {
                selectors[k++] = hexStringToBytes4(
                    substring(line, 9, bytes(line).length)
                );
            }
        }
    }

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

    function fromHex(bytes1 c) internal pure returns (uint8) {
        if (c >= 0x30 && c <= 0x39) return uint8(c) - 48; // '0'-'9'
        if (c >= 0x61 && c <= 0x66) return 10 + uint8(c) - 97; // 'a'-'f'
        if (c >= 0x41 && c <= 0x46) return 10 + uint8(c) - 65; // 'A'-'F'
        revert("bad hex");
    }

    // Helper function to get a substring
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
