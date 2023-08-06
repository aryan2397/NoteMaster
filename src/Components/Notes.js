import React, { useContext, useEffect, useRef,useState } from 'react'
import noteContext from '../Context/notes/noteContext';
import NoteItem from './NoteItem';
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
  let navigate = useNavigate();
  const context = useContext(noteContext);
  const { notes, getNotes, editNote } = context;
  const[note,setNote] = useState({id:"",etitle:"",edescription:"",etag:""})

  useEffect(() => {
    if(localStorage.getItem("token")){
      getNotes();
    }
    else{
      navigate("/login")
    }
    // eslint-disable-next-line
  }, [])

  const updateNote = (currentnote) => {
    ref.current.click();
    setNote({id:currentnote._id,etitle:currentnote.title,edescription:currentnote.description, etag:currentnote.tag});
  }

  const ref = useRef(null)
  const refClose = useRef(null)

  const handleClick=(e)=>{
    editNote(note.id,note.etitle,note.edescription,note.etag)
    refClose.current.click();
    props.showAlert("Updated successfully","success")
}

const onChange=(e)=>{
    setNote({...note,[e.target.name]:e.target.value})
}
  return (
    <>
      <AddNote showAlert={props.showAlert}/>
      <button type="button" className="btn btn-primary d-none" ref={ref} data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className='my-3'>
                <div className="mb-3">
                  <label htmlFor="etitle" className="form-label">Title</label>
                  <input onChange={onChange} value={note.etitle} type="text" className="form-control" id="etitle" name="etitle" aria-describedby="emailHelp" minLength={5} required/>
                </div>
                <div className="mb-3">
                  <label htmlFor="edescription" className="form-label" >Description</label>
                  <input value={note.edescription} onChange={onChange} type="text" className="form-control" id="edescription" name="edescription" minLength={5} required/>
                </div>
                <div className="mb-3">
                  <label htmlFor="etag" className="form-label" >Tag</label>
                  <input value={note.etag} onChange={onChange} type="text" className="form-control" id="etag" name="etag" minLength={5} required/>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button disabled={note.etitle.length<5 || note.edescription.length<5} onClick={handleClick} type="button" className="btn btn-primary">Update Note</button>
            </div>
          </div>
        </div>
      </div>

      <div className="row my-3">
        <h2>Your notes</h2>
        <div className="container mx-2">
            {notes.length===0 && 'No notes to display'}
          </div>
        {
          notes.map((note) => {
            return <NoteItem key={note._id} showAlert={props.showAlert} updateNote={updateNote} note={note} />;
          })
        }
      </div>
    </>
  )
}

export default Notes
