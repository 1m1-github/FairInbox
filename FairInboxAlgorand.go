package main

import (
	// "crypto/ed25519"
	"bytes"
	// "crypto/sha512"
	// "io"

	// "crypto/sha512"
	"fmt"
	"strconv"
	"strings"

	// "strings"

	// "github.com/algorand/go-algorand-sdk/v2/client/v2/algod"
	// "github.com/algorand/go-algorand-sdk/v2/client/kmd"
	// "github.com/algorand/go-algorand-sdk/crypto"
	// "github.com/algorand/go-algorand-sdk/v2/examples"
	// "github.com/algorand/go-algorand-sdk/v2/mnemonic"
	// "github.com/algorand/go-algorand-sdk/v2/types"
	"context"
	// "encoding/base32"
	"encoding/base32"
	"encoding/base64"
	"encoding/binary"
	"encoding/json"

	"github.com/algorand/go-algorand-sdk/v2/client/v2/indexer"

	// "golang.org/x/crypto/openpgp/elgamal"
	crypto_rand "crypto/rand"

	"golang.org/x/crypto/nacl/box"
)

func main() {
	encoding_decoding()
}

func encryption() {
	senderPublicKey, senderPrivateKey, _ := box.GenerateKey(crypto_rand.Reader)
	fmt.Println(senderPublicKey)
	fmt.Println(senderPrivateKey)

	fmt.Println(base64.StdEncoding.EncodeToString(senderPublicKey[:]))
	fmt.Println(base64.StdEncoding.EncodeToString(senderPrivateKey[:]))

	// var nonce [24]byte
	// io.ReadFull(crypto_rand.Reader, nonce[:])

	// msg := []byte("Alas, poor Yorick! I knew him, Horatio")
	// encrypted := box.Seal(nonce[:], msg, &nonce, recipientPublicKey, senderPrivateKey)

}

func printlog(txid string) {
	var indexerAddress = "https://algoindexer.testnet.algoexplorerapi.io/"
	var indexerToken = ""
	indexerClient, _ := indexer.MakeClient(
		indexerAddress,
		indexerToken,
	)

	transactionResult, _ := indexerClient.
		SearchForTransactions().
		TXID(txid).
		Do(context.Background())
	transactionJson, _ := json.MarshalIndent(transactionResult, "", "\t")
	fmt.Printf(string(transactionJson) + "\n")
}

func parseAppArgs(appArgsString string) (appArgs [][]byte, err error) {
	if appArgsString == "" {
		return make([][]byte, 0), nil
	}
	argsArray := strings.Split(appArgsString, ",")
	resp := make([][]byte, len(argsArray))

	for idx, arg := range argsArray {
		typeArg := strings.Split(arg, ":")
		switch typeArg[0] {
		case "str":
			resp[idx] = []byte(typeArg[1])
		case "int":
			intval, _ := strconv.ParseUint(typeArg[1], 10, 64)

			buf := new(bytes.Buffer)
			err := binary.Write(buf, binary.BigEndian, intval)
			if err != nil {
				return nil, fmt.Errorf("failed to convert %s to bytes", arg)
			}
			resp[idx] = buf.Bytes()
		case "b64":
			d, err := (base64.StdEncoding.DecodeString(typeArg[1]))
			if err != nil {
				return nil, fmt.Errorf("failed to b64 decode arg = %s", arg)
			}
			resp[idx] = d
		default:
			return nil, fmt.Errorf("Applications doesn't currently support argument of type %s", typeArg[0])
		}
	}
	return resp, err
}

func encoding_decoding() {
	// printlog("CVFCGRZTNV46GQR7GVJBECHTNF35M2C2CS6Z27JVYH5KXIY74WWA")

	// algodClient, _ := algod.MakeClient(
	// 	"node.testnet.algoexplorerapi.io",
	// 	"",
	// )
	// algodClient.GetApplicationBoxByName(190904981, "")

	// var decodedBoxNames [][]byte
	// var err error

	// a, _ := parseAppArgs("str:abc")
	// fmt.Println(a)

	// b, _ := parseAppArgs("int:256")
	// fmt.Println(b)

	// // dec:97 = hex:61 = b64:YQ==

	// // a2 := base64.StdEncoding.EncodeToString([]byte{97})
	// // fmt.Println(a2)

	// // a3, _ := base64.StdEncoding.DecodeString("YQ==")
	a, _ := base64.StdEncoding.DecodeString("6HcqGALC0CtTYz3wKXOtG0hciyzjBKEqANjWZWSOLCM=")
	fmt.Println(a)
	fmt.Println(base32.StdEncoding.EncodeToString(a))
	// // fmt.Println(a3)

	// c, _ := parseAppArgs("b64:PBjDGLtSYvmTNfGUafntgkObUCiDDm5cNTBRXRNV4uw1QjNTVUdBQ1lMSUNXVTNESFhZQ1M0NU5ETkVGWkNaTTRNQ0tDS1FBM0RMR0taRU9GUVI3NEhMR0VVAAAAAACflz0AAAAAAAAAAQAAAAAAAAABAAAAAAAAAAFDaGVsbG8gd29ybGQ=")
	// fmt.Println(c)

	// fmt.Println(string([]byte{53, 66, 51}))
	// // d, err := base32.StdEncoding.DecodeString("HQMMGGF3KJRPTEZV6GKGT6PNQJBZWUBIQMHG4XBVGBIV2E2V4LWOFHVEAA")
	// d, err := base32.StdEncoding.WithPadding(base32.NoPadding).DecodeString("HQMMGGF3KJRPTEZV6GKGT6PNQJBZWUBIQMHG4XBVGBIV2E2V4LWOFHVEAA")
	// fmt.Println(err)
	// fmt.Println(len(d))
	// fmt.Println(d)

	// address to []byte
	// a_with_checksum, _ := base32.StdEncoding.WithPadding(base32.NoPadding).DecodeString("HQMMGGF3KJRPTEZV6GKGT6PNQJBZWUBIQMHG4XBVGBIV2E2V4LWOFHVEAA")
	// a := a_with_checksum[:32]
	// fmt.Println(a)

	// b_with_checksum, _ := base32.StdEncoding.WithPadding(base32.NoPadding).DecodeString("5B3SUGACYLICWU3DHXYCS45NDNEFZCZM4MCKCKQA3DLGKZEOFQR74HLGEU")
	// // b := []byte("5B3SUGACYLICWU3DHXYCS45NDNEFZCZM4MCKCKQA3DLGKZEOFQR74HLGEU")
	// b := b_with_checksum[:32]
	// fmt.Println(b)

	// // int to []byte
	// curreny_id_int := 10458941
	// currency_id := make([]byte, 8)
	// binary.BigEndian.PutUint64(currency_id, uint64(curreny_id_int))
	// fmt.Println(currency_id)

	// curreny_amount_int := 1
	// currency_amount := make([]byte, 8)
	// binary.BigEndian.PutUint64(currency_amount, uint64(curreny_amount_int))
	// fmt.Println(currency_amount)

	// note := "hello world"
	// fmt.Println([]byte(note))
	// fmt.Println(base64.StdEncoding.DecodeString("aGVsbG8gd29ybGQ="))

	// bid_id_prehash := append(a, b...)
	// bid_id_prehash = append(bid_id_prehash, currency_id...)
	// bid_id_prehash = append(bid_id_prehash, currency_amount...)
	// bid_id_prehash = append(bid_id_prehash, note...)
	// fmt.Println(bid_id_prehash)

	// bid_id := sha512.Sum512_256(bid_id_prehash)
	// fmt.Println(bid_id)
	// bid_id_b64 := base64.StdEncoding.EncodeToString(bid_id[:])
	// fmt.Println(bid_id_b64)

	// a := []byte("a")
	// fmt.Println(a)
	// b := string(a)
	// fmt.Println(b)
}