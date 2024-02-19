import './App.css'
import axios from 'axios';
import prettyBytes from 'pretty-bytes';
import React, { useEffect, useRef, useState } from "react";
import ReactDOMServer from 'react-dom/server'
import Datakeycomponent from './Datakeycomponent'

function App() {

  const queryParamsContainer = useRef(null);
  const requestHeadersContainer = useRef(null);
  const form = useRef(null);
  const responseHeadersContainers = useRef(null);
  const data_url = useRef(null);
  const data_method = useRef(null);
  const data_response_section = useRef(null);
  //const data_key_value_pair = useRef(null);Datakeycomponent
  const data_key = useRef(null)
  const data_value = useRef(null)
  //const data_remove_btn = useRef(null);

  const [resp, setResp] = useState();

  

  useEffect(() => {
    //queryParamsContainer.current.append(createKeyValuePair())
    //requestHeadersContainer.current.append(createKeyValuePair())


    axios.interceptors.request.use(request => {
        request.customData = request.customData || {}
        request.customData.startTime = new Date().getTime()
        return request
    })

    axios.interceptors.response.use(updateEndTime, e=> {
        return Promise.reject(updateEndTime(e.response))
    })

  },[]);
  
  

  

  const submitfunction = (e) => {
    e.preventDefault()
    console.log("clicked");

    console.log(data_url.current.value);
    console.log(data_method.current.value)

    axios({
        url: data_url.current.value,
        method: data_method.current.value,
        params: keyValuePairstoObject(queryParamsContainer),
        headers: keyValuePairstoObject(requestHeadersContainer),
    })
    .catch(e => e)
    .then(response => {
        data_response_section.current.classList.remove("d-none")
        console.log(response)
        updateResponseDetails(response)
        setResp(response.data);
        console.log(response.headers);
        updateresponseHeaders(response.headers)
        
    })
  }


  // function createKeyValuePair()
  // {
  //     const ele = queryParamsContainer.current;     
  //     //ele.appendChild(<Datakeycomponent/>);

  //     //return <Datakeycomponent/>
  // }

  function keyValuePairstoObject(container)
  {
    const dummies = document.getElementsByClassName('dum');
    console.log(dummies.length);
    //const pairs = container.querySelectorAll('[data-key-value-pair]')
    return [...dummies].reduce((data, pair) => {
        const key = pair.querySelector('[data-key]').value
        const value = pair.querySelector('[data-value]').value

        if(key === '')
        {
            return data
        }

        return {...data, [key]:value}
    }, {})
  }

  

  function updateEndTime(response){
      response.customData = response.customData || {}
      response.customData.time = new Date().getTime() - response.config.customData.startTime

      return response
  }
  

  //const {requestEditor, updateResponseEditor} = setupEditors()

  
  function updateResponseDetails(response)
  {
      document.getElementById('data-status').textContent = response.status;
      document.getElementById('data-time').textContent = response.customData.time;
      document.getElementById('data-size').textContent = prettyBytes(
          JSON.stringify(response.data).length + JSON.stringify(response.data).length
      )
  }
  function updateresponseHeaders(headers)
  { 
      responseHeadersContainers.innerHTML = "";
      console.log(Object.entries(headers));
      Object.entries(headers).forEach(([key,value]) => {
          const keyElement = document.createElement("div");
          keyElement.textContent = key
          console.log(responseHeadersContainers.current);
          responseHeadersContainers.current.append(keyElement)

          const valueElement = document.createElement("div");
          valueElement.textContent = value
          responseHeadersContainers.current.append(valueElement)
      })
  }
  // document.getElementById('data-add-query-param-btn').addEventListener("click", ()=>{
  //     queryParamsContainer.append(createKeyValuePair())
  // })

  // const queryappend = (e) =>{
  //   e.preventDefault();
  //   //queryParamsContainer.current.append(createKeyValuePair());
  // }

  // // document.getElementById('data-add-request-headers-btn').addEventListener("click", ()=>{
  // //     requestHeadersContainer.append(createKeyValuePair())
  // // })

  // const requestheaderappend = (e) => {
  //   e.preventDefault();
  //   requestHeadersContainer.current.append(createKeyValuePair());
  // }

  return (
    <>
          <div className="p-4">
              <form id="data-form">
                <div className="input-group mb-4">
                    <div className="input-group-prepend">
                    <select className="form-select flex-grow-0 w-auto" ref={data_method}>
                        <option value="GET" defaultChecked>GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="PATCH">PATCH</option>
                        <option value="DELETE">DELETE</option>
                    </select>
                    </div>
                    <input ref={data_url} className="form-control" type="url" placeholder="https://example.com"/>
                    <button ref={form} type="button" onClick={submitfunction} className="btn btn-primary">Send</button>
                </div>
                <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="query-params-tab" type="button" data-bs-toggle="tab" data-bs-target="#query-params" role="tab" aria-controls="query-params" aria-selected="true">Query Params</button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link" id="request-headers-tab" type="button" data-bs-toggle="tab" data-bs-target="#request-headers" role="tab" aria-controls="request-headers" aria-selected="true">Headers</button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link" id="json-tab" type="button" data-bs-toggle="tab" data-bs-target="#json" role="tab" aria-controls="json" aria-selected="true">JSON</button>
                    </li>
                </ul>
                <div className="tab-content p-3 border-top-0 border">
                      <div className="tab-pane fade show active" id="query-params" role="tabpanel" aria-labelledby="query-params-tab">
                          <div ref={queryParamsContainer}>
                            <Datakeycomponent/>
                          </div>
                      </div> 
                      <div className="tab-pane fade" id="request-headers" role="tabpanel" aria-labelledby="request-headers-tab">
                          <div id="data-request-headers" ref={requestHeadersContainer}> 
                            <Datakeycomponent/>
                          </div>  
                      </div>
                      <div className="tab-pane fade show" id="json" role="tabpanel" aria-labelledby="json-tab">
                          <div id="data-json-request-body" className="overflow-auto" style={{maxHeight: '200px'}}></div>
                      </div>
                </div>
            </form>
            <div className="mt-5 d-none" ref={data_response_section}> 
                <h3>Response</h3>
                <div className="d-flex my-2">
                    <div className="me-3">
                        Status: <span id="data-status">200</span>
                    </div>
                    <div className="me-3">
                        Time: <span id="data-time"></span>ms
                    </div>
                    <div className="me-3">
                        Size: <span id="data-size"></span>
                    </div>
                </div> 

                <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="body-tab" type="button" data-bs-toggle="tab" data-bs-target="#body" role="tab" aria-controls="body" aria-selected="true">Body</button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link" id="response-headers-tab" type="button" data-bs-toggle="tab" data-bs-target="#response-headers" role="tab" aria-controls="response-headers" aria-selected="true">Headers</button>
                    </li>
                </ul>

                <div className="tab-content p-3 border-top-0 border">
                    <div className="tab-pane fade show active" id="body" role="tabpanel" aria-labelledby="body-tab">
                        <div id="data-json-response-body" className="overflow-auto" style={{maxHeight: '200px'}}><pre>{JSON.stringify(resp, null, 2)}</pre></div>
                    </div> 
                    <div className="tab-pane fade" id="response-headers" role="tabpanel" aria-labelledby="response-headers-tab">
                        <div style={{display:'grid', gridTemplateColumns:'auto 1fr', gap: '2rem 2rem'}} ref={responseHeadersContainers}></div>
                    </div>
                </div>
            </div>
        </div>       
    </>
  )
}

export default App
