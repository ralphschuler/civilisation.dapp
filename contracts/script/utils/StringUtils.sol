// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

library StringUtils {
    function splitLines(
        string memory s
    ) internal pure returns (string[] memory) {
        bytes memory b = bytes(s);

        // Zähle Anzahl Zeilen
        uint256 count = 1;
        for (uint256 i = 0; i < b.length; i++) {
            if (b[i] == 0x0a) {
                // '\n'
                count++;
            }
        }

        string[] memory parts = new string[](count);
        uint256 lastIndex = 0;
        uint256 partIndex = 0;
        for (uint256 i = 0; i < b.length; i++) {
            if (b[i] == 0x0a) {
                parts[partIndex++] = substring(s, lastIndex, i);
                lastIndex = i + 1;
            }
        }
        if (lastIndex < b.length) {
            parts[partIndex] = substring(s, lastIndex, b.length);
        }

        return parts;
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
