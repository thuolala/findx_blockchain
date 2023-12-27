// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Traceability {

    // Define a struct to represent a shipment
    struct Shipment {
        string productId;
        string productName;
        string category;
        string from;
        string to;
        string dateAdded;
        string status;
    }

    // Mapping to store arrays of shipments
    mapping(uint256 => Shipment[]) public shipments;
    uint256 public shipmentsCount;

    constructor() {
    }
    fallback() external payable {}

    // Event to emit when a new shipment is added
    event ShipmentAdded(string productId, string productName, string category, string from, string to, string dateAdded, string status);

    // Function to add a new shipment
    function addShipment(
        string memory _productId,
        string memory _productName,
        string memory _category,
        string memory _from,
        string memory _to,
        string memory _dateAdded,
        string memory _status
    ) external {
        // Ensure shipmentId is unique
        uint256 hashedId = uint256(keccak256(abi.encodePacked(_productId)));

        // Create a new shipment
        Shipment memory newShipment = Shipment({
            productId: _productId,
            productName: _productName,
            category: _category,
            from: _from,
            to: _to,
            dateAdded: _dateAdded,
            status: _status
        });

        // Add the shipment to the array in the mapping
        shipments[hashedId].push(newShipment);
    
        // Emit an event
        emit ShipmentAdded( _productId, _productName, _category, _from, _to, _dateAdded, _status);
    }


    function getShipment(string memory _productId) public view returns (
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        string memory
    ) {
        uint256 hashedId = uint256(keccak256(abi.encodePacked(_productId)));
        Shipment[] storage shipmentArray = shipments[hashedId];
        Shipment storage shipment = shipmentArray[0];

        return (
            shipment.productId,
            shipment.productName,
            shipment.category,
            shipment.from,
            shipment.to,
            shipment.dateAdded,
            shipment.status
        );
    }

    function getAllShipmentId(string memory _productId) public view returns (
        Shipment[] storage
    ) {
        uint256 hashedId = uint256(keccak256(abi.encodePacked(_productId)));
        Shipment[] storage shipmentArray = shipments[hashedId];

        return shipmentArray;
    }
}