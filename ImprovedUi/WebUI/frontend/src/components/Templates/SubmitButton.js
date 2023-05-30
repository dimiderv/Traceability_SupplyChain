export default function SubmitButton({buttonText, fetchPostReply,disabled}){
    return (
        <div className="form-group row d-block">
        <div className="col-sm-12">
          <button
            type="submit"
            value="Send"
            onClick={fetchPostReply}
            className="btn btn-primary"
            disabled={disabled}
          >
            {buttonText}
          </button>
          {/* onClickCapture also worked */}
        </div>
      </div>
    )
}