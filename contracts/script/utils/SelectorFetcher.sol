pragma solidity ^0.8.30;

import "forge-std/Script.sol";

abstract contract SelectorFetcher is Script {
    function selectorsFor(string memory fqcn) internal returns (bytes4[] memory selectors) {
        string;
        cmd[0] = "bash";
        cmd[1] = "-lc";
        cmd[2] = string(
            abi.encodePacked(
                "forge selectors list ",
                fqcn,
                " | awk -F'|' '/Function/ {gsub(/ /, \"\", $4); printf \"SELECTOR:%s\\n\", $4}'"
            )
        );
        bytes memory out = vm.ffi(cmd);

        // Convert to string
        string memory output = string(out);

        // Split manually
        string[] memory lines = splitString(output, "\n");

        uint256 n = 0;
        for (uint256 i = 0; i < lines.length; i++) {
            if (bytes(lines[i]).length > 9 && bytes(lines[i])[0] == "S") {
                n++;
            }
        }
        selectors = new bytes4[](n);
        uint256 k = 0;
        for (uint256 i = 0; i < lines.length; i++) {
            string memory line = lines[i];
            if (bytes(line).length > 9 && bytes(line)[0] == "S") {
                selectors[k++] = hexStringToBytes4(substring(line, 9, bytes(line).length));
            }
        }
    }

    // --- helper: split a string by a delimiter ---
    function splitString(
        string memory s,
        string memory delim
    ) internal pure returns (string[] memory) {
        bytes memory b = bytes(s);
        bytes memory d = bytes(delim);
        require(d.length == 1, "only single-char delimiter supported");

        // Count parts
        uint256 parts = 1;
        for (uint256 i = 0; i < b.length; i++) {
            if (b[i] == d[0]) {
                parts++;
            }
        }

        string[] memory tokens = new string[](parts);
        uint256 last = 0;
        uint256 idx = 0;

        for (uint256 i = 0; i <= b.length; i++) {
            if (i == b.length || b[i] == d[0]) {
                bytes memory token = new bytes(i - last);
                for (uint256 j = 0; j < i - last; j++) {
                    token[j] = b[last + j];
                }
                tokens[idx++] = string(token);
                last = i + 1;
            }
        }
        return tokens;
    }

    function hexStringToBytes4(string memory s) internal pure returns (bytes4 r) {
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
        if (c >= 0x30 && c <= 0x39) return uint8(c) - 48;
        if (c >= 0x61 && c <= 0x66) return 10 + uint8(c) - 97;
        if (c >= 0x41 && c <= 0x46) return 10 + uint8(c) - 65;
        revert("bad hex");
    }

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
