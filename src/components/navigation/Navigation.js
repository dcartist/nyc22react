import React from 'react'
import { Menubar } from 'primereact/menubar';
import { useHistory } from "react-router-dom";

export default function Navigation(props) {
    let history = useHistory();
    let NavigateToPage = (path) =>{
        // let history = useHistory();
		console.log('Navigate to path ' + path);
        history.push(path);
		// this.props.history.push(path);
        // showInfoMessage(this,'Navigation',path);
        // const history = useHistory();
        // console.log(history);
    
          
        }

        //  let HomeButton = () => {
        //     let history = useHistory();
        //  }
            let handleClick = () => {
                
              history.push("/home");
            }
    
    const items = [
        {
           label:'File',
           icon:'pi pi-fw pi-file',
           items:[
              {
                 label:'New',
                 icon:'pi pi-fw pi-plus',
                 items:[
                    {
                       label:'Bookmark',
                       icon:'pi pi-fw pi-bookmark'
                    },
                    {
                       label:'Video',
                       icon:'pi pi-fw pi-video'
                    },
    
                 ]
              },
              {
                 label:'Delete',
                 icon:'pi pi-fw pi-trash'
              },
              {
                 separator:true
              },
              {
                 label:'Export',
                 icon:'pi pi-fw pi-external-link'
              }
           ]
        },
        {
           label:'Edit',
           icon:'pi pi-fw pi-pencil',
           items:[
              {
                 label:'Left',
                 icon:'pi pi-fw pi-align-left'
              },
              {
                 label:'Right',
                 icon:'pi pi-fw pi-align-right'
              },
              {
                 label:'Center',
                 icon:'pi pi-fw pi-align-center'
              },
              {
                 label:'Justify',
                 icon:'pi pi-fw pi-align-justify'
              },
    
           ]
        },
        {
           label:'Users',
           icon:'pi pi-fw pi-user',
           items:[
              {
                 label:'New',
                 icon:'pi pi-fw pi-user-plus',
    
              },
              {
                 label:'Delete',
                 icon:'pi pi-fw pi-user-minus',
    
              },
              {
                 label:'Search',
                 icon:'pi pi-fw pi-users',
                 items:[
                    {
                       label:'Filter',
                       icon:'pi pi-fw pi-filter',
                       items:[
                          {
                             label:'Print',
                             icon:'pi pi-fw pi-print'
                          }
                       ]
                    },
                    {
                       icon:'pi pi-fw pi-bars',
                       label:'List'
                    }
                 ]
              }
           ]
        },
        {
           label:'Events',
           icon:'pi pi-fw pi-calendar',
           items:[
              {
                 label:'Edit',
                 icon:'pi pi-fw pi-pencil',
                 items:[
                    {
                       label:'Save',
                       icon:'pi pi-fw pi-calendar-plus'
                    },
                    {
                       label:'Delete',
                       icon:'pi pi-fw pi-calendar-minus'
                    },
    
                 ]
              },
              {
                 label:'Archieve',
                 icon:'pi pi-fw pi-calendar-times',
                 items:[
                    {
                       label:'Remove',
                       icon:'pi pi-fw pi-calendar-minus'
                    }
                 ]
              }
           ]
        },
        {
           label:'Quiting',
           icon:'pi pi-fw pi-power-off',
           command:(e) => {
             console.log("click")
           NavigateToPage("/")
             
        }
        }
     ];
    
   
    
    return (
        
        <div>
            <Menubar model={items}/>
        </div>
    )
}
