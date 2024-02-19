
import React, {useState} from 'react'; 
import { date } from 'zod';


function Datakeycomponent()
{
    const[data, setdata] = useState([{key: "", value: ""}])

    const handleClick=()=>{
        setdata([...data, {key:"",value:""}])
    }

    const submit = (e) => {
        e.preventDefault();
        console.log(data)
    }

    const handleChange = (event, index) => {
        console.log(index);
        let data = [...data];
        data[index][event.target.name] = event.target.value;
        setdata(data);
    }

    const handleDelete=(i)=>{
        const deleteVal = [...data]
        deleteVal.splice(i,1)
        setdata(deleteVal)
    }

    return(
    <>
        <div>
            <form onSubmit={submit}>
            {data.map((val, i) => {
                return (
                    <div className="input-group my-2 data_key_value_pair" key={i}>
                        <input name='key'  type="text" className="form-control" placeholder="Key" />
                        <input name='value'  type="text" className="form-control" placeholder="Value" />
                        <button type="button" className="btn btn-outline-danger data_remove_btn" onClick={()=>handleDelete(i)}>Remove</button>
                    </div>
             )     
            })}
            </form>
        </div>
        <button id="data-add-query-param-btn" onClick={handleClick} className="mt-2 btn btn-outline-success" type="button">Add</button>
    </>
)
}

export default Datakeycomponent