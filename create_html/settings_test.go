package settings

import (
	"testing"
)

func TestCreateButton(t *testing.T) {
    testcases := []struct {
        in int
		want string
    }{
        {7, `<input type="number" value="7">`},
        // {15, `<input type="number" value="15">`},
    }
    for _, tc := range testcases {
        NodeToString(CreateButton(tc.in))
		// t.Log(rev)
        // if rev != tc.want {
        //         t.Errorf("Reverse: %q, want %q", rev, tc.want)
        // }
    }
}
