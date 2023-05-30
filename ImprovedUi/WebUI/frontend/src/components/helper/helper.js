export function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

/**
 * Handles Fetch requests. Gets URL, setState function for items
 * and done parameter to activate loading component
 * @param {String} link
 * @param {Function} setItems
 * @param {Function} setDone
 */
export function handleGetFetch(link, setItems, setDone) {
  setTimeout(() => {
    fetch(link)
      .then(handleErrors)
      .then((respose) => respose.json())
      .then((json) => {
        setItems(json);
        setDone(true);
        console.log("Successully runs");
      })
      .catch(function (error) {
        console.log("Get fetch works");
        setDone(true);
      });
  }, 2000);
}

/**
 * Handles Fetch requests. Gets URL, setState function for items
 * and done parameter to activate loading component
 * @param {String} link
 * @param {Function} setItems
 * @param {Function} setDone
 */
export function handlePost(formData, link, setPostReply, setLoading) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  };

  setLoading(true);
  
  setTimeout(() => {
    fetch(link, options)
      .then(handleErrors)
      .then((respose) => respose.json())
      .then((json) => {
        setPostReply(json);
        
        setLoading(false);
        console.log("Successully runs");
      })
      .catch(function (error) {
        console.log("Post catch works");
        setLoading(false);
        setPostReply({
            errorCLI:"Server Error",
            errorStatus: 521,
            errorMessage:"Server is down. Please make sure that ledger is setup"
        });
      });
  }, 1000);
}
