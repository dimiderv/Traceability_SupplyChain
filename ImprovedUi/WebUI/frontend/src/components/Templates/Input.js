export default function Input({label, handleChange, id, placeholder,type}){
    return(
        <div className="form-group w-25 mx-auto">
        <label htmlFor="type" className="col-form-label mx-auto">{label} </label>
        {/* col-xs-3 */}
        <div className="col-sm-10 w-10 mx-auto">
            <input type={type} className="form-control " required onChange={handleChange} id={id} placeholder={placeholder}/>
        </div>
    </div>

    )
}