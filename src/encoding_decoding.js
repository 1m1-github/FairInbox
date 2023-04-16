

let addr_bytes = algosdk.decodeAddress("HQMMGGF3KJRPTEZV6GKGT6PNQJBZWUBIQMHG4XBVGBIV2E2V4LWOFHVEAA")
console.log(addr_bytes)

let int_bytes = algosdk.bigIntToBytes(1)
console.log(int_bytes)

let str_bytes = algosdk.encodeObj("hello world")
console.log(str_bytes)

