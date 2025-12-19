import {useState,useEffect} from "react"

const questions=[
    {id:"name",label:"Your Name",type:"text"},
    {id:"gender",label:"Gender",type:"select",options:["Male","Female","Other"]}
]

export default function App(){
    const [form,setForm]=useState({})
    const [responses,setResponses]=useState([])
    const [view,setView]=useState("form")

    const handleChange=(id,value)=>{
        setForm({...form,[id]:value})
    }

    const submitForm=async()=>{
        await fetch("http://localhost:5000/responses",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(form)
        })
        alert("Form submitted successfully")
        setForm({})
    }

    const loadResponses=async()=>{
        const res=await fetch("http://localhost:5000/responses")
        const data=await res.json()
        setResponses(data)
    }

    useEffect(()=>{
        if(view==="admin") loadResponses()
    },[view])

    return(
        <div className="page">
            <div className="top-buttons">
                <button className={view==="form"?"active":""} onClick={()=>setView("form")}>Form</button>
                <button className={view==="admin"?"active":""} onClick={()=>setView("admin")}>Admin</button>
            </div>

            {view==="form" && (
                <div className="card">
                    <h2>Mini Form</h2>
                    {questions.map(q=>(
                        <div className="field" key={q.id}>
                            <label>{q.label}</label>
                            {q.type==="text" && (
                                <input
                                    placeholder={`Enter ${q.label}`}
                                    value={form[q.id]||""}
                                    onChange={e=>handleChange(q.id,e.target.value)}
                                />
                            )}
                            {q.type==="select" && (
                                <select
                                    value={form[q.id]||""}
                                    onChange={e=>handleChange(q.id,e.target.value)}
                                >
                                    <option value="">Select</option>
                                    {q.options.map(opt=>(
                                        <option key={opt}>{opt}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    ))}
                    <button className="submit-btn" onClick={submitForm}>Submit</button>
                </div>
            )}

            {view==="admin" && (
                <div className="card">
                    <h2>Responses</h2>
                    <table>
                        <thead>
                            <tr>
                                {questions.map(q=>(
                                    <th key={q.id}>{q.label}</th>
                                ))}
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {responses.map((r,i)=>(
                                <tr key={i}>
                                    {questions.map(q=>(
                                        <td key={q.id}>{r[q.id]}</td>
                                    ))}
                                    <td>{r.timestamp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
