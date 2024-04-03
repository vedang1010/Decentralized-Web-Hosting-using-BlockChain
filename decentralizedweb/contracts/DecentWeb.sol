// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

// User Registry Contract
contract UserRegistry {
    mapping(address => string) public users;
    mapping(address => bool) public isRegistered;

    event UserRegistered(address indexed user, string username);

    function registerUser(string memory username) public {
        require(!isRegistered[msg.sender], "User already registered");
        users[msg.sender] = username;
        isRegistered[msg.sender] = true;
        emit UserRegistered(msg.sender, username);
    }

    function getUsername(address user) public view returns (string memory) {
        return users[user];
    }

    function isUserRegistered(address user) public view returns (bool) {
        return isRegistered[user];
    }
    
}

// Website Storage Contract
contract WebsiteStorage {
    struct Website {
        string domain;
        string contentHash; // IPFS hash or other decentralized storage reference
        // Add other website data as needed
    }
    mapping(string => Website) public websites;

    event WebsiteRegistered(string domain, string contentHash);

    // constructor(string memory _domain, string memory _contentHash) {
    //     require(bytes(websites[_domain].domain).length == 0, "Website already registered");
    //     websites[_domain] = Website(_domain, _contentHash);
    //     emit WebsiteRegistered(_domain, _contentHash);
    // }

    function registerWebsite(string memory _domain, string memory _contentHash) public {
        require(bytes(websites[_domain].domain).length == 0, "Website already registered");
        websites[_domain] = Website(_domain, _contentHash);
        emit WebsiteRegistered(_domain, _contentHash);
    }
}

// Domain Name System (DNS) Contract
contract DNSContract {
    struct Domain {
        address owner;
        string contentHash; // IPFS hash or other decentralized storage reference
        // Add other DNS-related data as needed
    }
    mapping(string => Domain) public domains;

    event DomainRegistered(string domain, address owner, string contentHash);

    // constructor(string memory _domain, string memory _contentHash) {
    //     require(domains[_domain].owner == address(0), "Domain already registered");
    //     domains[_domain] = Domain(msg.sender, _contentHash);
    //     emit DomainRegistered(_domain, msg.sender, _contentHash);
    // }

    function registerDomain(string memory _domain, string memory _contentHash) public {
        require(domains[_domain].owner == address(0), "Domain already registered");
        domains[_domain] = Domain(msg.sender, _contentHash);
        emit DomainRegistered(_domain, msg.sender, _contentHash);
    }
}