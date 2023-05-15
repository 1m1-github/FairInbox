package settings

import (
	"bytes"
	"fmt"
	"strings"

	"golang.org/x/net/html"
)

const chr_importance_HMTL = `<input type="number" value="23">`

func showNode(doc *html.Node) {
	// fmt.Println(doc)
	// fmt.Println(doc.Attr)
	// fmt.Println(doc.Data)
	// fmt.Println(doc.Type)
	// fmt.Println(doc.Parent)
	// fmt.Println(doc.FirstChild)
	fmt.Println(NodeToString(doc))
}

func CreateButton(v int) *html.Node {
	doc, _ := html.Parse(strings.NewReader(chr_importance_HMTL))
	// showNode(doc.FirstChild.LastChild.FirstChild)
	doc.FirstChild.LastChild.FirstChild.Attr = []html.Attribute{{Key: "class", Val: "mybutton"}, {Key: "value", Val: fmt.Sprint(v)}}
	// showNode(doc.FirstChild.LastChild.FirstChild)

	doc2, _ := html.Parse(strings.NewReader(chr_importance_HMTL))
	showNode(doc)
	doc.AppendChild(doc2)
	showNode(doc)

	return doc
}

func NodeToString(n *html.Node) string {
	var b bytes.Buffer
	html.Render(&b, n)
	return b.String()
}
