import ReactLoading from 'react-loading';
const spinner= {
    flex: 1,
    alignSelf:'center',

}
// const spinnerStyle= {
//   display:'flex',
//   marginTop:140,
//   justifyContent: 'center',
//   alignitems:'center'
// }

export default function Loading() {
  return (
    <div
      className="box container"
      style={{ maxWidth: "900px", padding: "200px 100px 100px 100px" }}
    >
      <ReactLoading
        type={"bars"}
        color={"#03fc4e"}
        height={10}
        width={10}
        style={spinner}
      />
    </div>
  );
}
