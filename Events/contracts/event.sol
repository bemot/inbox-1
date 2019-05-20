pragma solidity ^0.5.8;

contract Event {
    event LogDataHash(bytes32 datahash);
    function log(bytes32 datahash) public payable {
        emit LogDataHash(datahash);
    }
}
