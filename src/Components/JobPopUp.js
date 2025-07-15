import React,  { useState } from 'react';
import {Button, Modal} from 'react-bootstrap';
export default function JobPopUp(props) {
const [show, setShow] = useState(false);
const parse = require('html-react-parser');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
          More Info
      </Button>

      <Modal show={show} onHide={handleClose} 
        dialogClassName="modal-90w" size="lg">
        <Modal.Header closeButton>
            <Modal.Title>{props.business_title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <h2>Description</h2>
            <p>{parse(props.job_description)}</p>
            <hr></hr>
            
            </Modal.Body>
        <Modal.Footer>
      
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );

}
