pragma solidity ^0.5.8;

contract Storage {
    //address of admin w/ permissions
    address public admin;
    //hash(user id & hash(data)) :
    bytes32[] public data_hashes;

    constructor() public {
        //set contract creator as admin
        admin = msg.sender;
    }

    function addDataHash(bytes32 dh) public restricted {
        data_hashes.push(dh);
    }

    modifier restricted() {
        require(msg.sender == admin);
        _;
    }
}
