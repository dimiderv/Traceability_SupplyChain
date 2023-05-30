export default function BackButton({link}){
return(    <div>
    <p className="text-center d-block">
      <a
        href={link}
        className="btn btn-small btn-primary"
      >
        Go back
      </a>
    </p>
  </div>)
}