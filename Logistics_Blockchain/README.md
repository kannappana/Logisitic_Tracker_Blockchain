Logistics Temperature Tracker 

Prerequisites and setup:

Install the below software in “Ubuntu Machine”
1.	Docker 
2.	Docker compose
3.	Nodejs
4.	Download Hyperledger fabric images (curl -sSL http://bit.ly/2ysbOFE | bash -s)
5.	Git client

Once you have completed the above setup, you will have provisioned a local network with the following docker container configuration:
•	3 CAs
•	A SOLO orderer
•	6 peers (2 peers per Org)

Artifacts:
•	Crypto material has been generated using the cryptogen tool from Hyperledger Fabric and mounted to all peers, the orderering node and CA containers. 
•	An Orderer genesis block (genesis.block) and channel configuration transaction (mychannel.tx) has been pre generated using the configtxgen tool from Hyperledger Fabric and placed within the artifacts folder.

Running the Fabric network:

Launch the network using docker-compose:
1.	Go to Logistics_Blockchain/artifacts.
2.	Run “./up” to start the network.

Install the required node modules:
1.	npm install

Start the Node App:
1.	Go to Logistics_Blockchain/
2.	Run “PORT=4000 node app”
3.	Run “PORT=5000 node server.js”

Rest API request:

Login Request:

Enroll a user in organisations and store the token for later purpose: 

curl -s -X POST http://localhost:4000/users -H "content-type: application/x-www-form-urlencoded" -d 'username=Jim&orgName=Org1'
curl -s -X POST http://localhost:4000/users -H "content-type: application/x-www-form-urlencoded" -d 'username=Jim&orgName=Org2'
curl -s -X POST http://localhost:4000/users -H "content-type: application/x-www-form-urlencoded" -d 'username=Jim&orgName=Org3'

Create Channel Request:
curl -s -X POST \
  http://localhost:4000/channels \
  -H "authorization: Bearer <put ORG 1 JSON Web Token here>" \
  -H "content-type: application/json" \
  -d '{
	"channelName":"mychannel",
	"channelConfigPath":"../artifacts/channel/channel.tx"
}'

Join peers to mychannel:

Org1 peers:
curl -s -X POST \
  http://localhost:4000/channels/mychannel/peers \
  -H "authorization: Bearer <put ORG 1 JSON Web Token here>" \
  -H "content-type: application/json" \
  -d '{
	"peers": ["peer0.org1.example.com","peer1.org1.example.com"]
}'

Org2 peers:
curl -s -X POST \
  http://localhost:4000/channels/mychannel/peers \
  -H "authorization: Bearer <put ORG 2 JSON Web Token here>" \
  -H "content-type: application/json" \
  -d '{
	"peers": ["peer0.org2.example.com","peer1.org2.example.com"]
}'

Org3 peers:
curl -s -X POST \
  http://localhost:4000/channels/mychannel/peers \
  -H "authorization: Bearer <put ORG 3 JSON Web Token here>" \
  -H "content-type: application/json" \
  -d '{
	"peers": ["peer0.org3.example.com","peer1.org3.example.com"]
}'

Update Anchor Peers:

curl -s -X POST \
  http://localhost:4000/channels/mychannel/anchorpeers \
  -H "authorization: Bearer <put ORG 1 JSON Web Token here>" \
  -H "content-type: application/json" \
  -d '{
	"configUpdatePath":"../artifacts/config/Org1MSPanchors.tx"
}'

curl -s -X POST \
  http://localhost:4000/channels/mychannel/anchorpeers \
  -H "authorization: Bearer <put ORG 2 JSON Web Token here>" \
  -H "content-type: application/json" \
  -d '{
	"configUpdatePath":"../artifacts/config/Org2MSPanchors.tx"
}'

curl -s -X POST \
  http://localhost:4000/channels/mychannel/anchorpeers \
  -H "authorization: Bearer <put ORG 3 JSON Web Token here>" \
  -H "content-type: application/json" \
  -d '{
	"configUpdatePath":"../artifacts/config/Org3MSPanchors.tx"
}'

Install Chaincode:
curl -s -X POST \
  http://localhost:4000/chaincodes \
  -H "authorization: Bearer <put ORG 1 JSON Web Token here>"" \
  -H "content-type: application/json" \
  -d '{
	"peers": ["peer0.org1.example.com","peer1.org1.example.com"],
	"chaincodeName":"mycc",
	"chaincodePath":"artifacts/src/github.com/example_cc/node",
	"chaincodeType": "node",
	"chaincodeVersion":"v1"
}'

curl -s -X POST \
  http://localhost:4000/chaincodes \
  -H "authorization: Bearer <put ORG 2 JSON Web Token here>"" \
  -H "content-type: application/json" \
  -d '{
	"peers": ["peer0.org2.example.com","peer1.org2.example.com"],
	"chaincodeName":"mycc",
	"chaincodePath":"artifacts/src/github.com/example_cc/node",
	"chaincodeType": "node",
	"chaincodeVersion":"v1"
}'
curl -s -X POST \
  http://localhost:4000/chaincodes \
  -H "authorization: Bearer <put ORG 3 JSON Web Token here>" \
  -H "content-type: application/json" \
  -d '{
	"peers": ["peer0.org3.example.com","peer1.org3.example.com"],
	"chaincodeName":"mycc",
	"chaincodePath":"artifacts/src/github.com/example_cc/node",
	"chaincodeType": "node",
	"chaincodeVersion":"v1"
}'

Instantiate Chaincode:

curl -s -X POST \
  http://localhost:4000/channels/mychannel/chaincodes \
  -H "authorization: Bearer <put ORG 3 JSON Web Token here>" \
  -H "content-type: application/json" \
  -d '{
	"chaincodeName":"mycc",
	"chaincodeVersion":"v1",
	"chaincodeType": "node",
	"args":["a","100","b","200"]
}'

Now we have Hyperledger fabric network and app is ready. All organisations have been joined the Channel(mychannel). Chaincode hase been installed on all the peers and instantiated on mychannel.
