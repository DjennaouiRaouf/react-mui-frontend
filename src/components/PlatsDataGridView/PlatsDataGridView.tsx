import * as React from "react";
import {DataGrid, GridColDef, GridRowSelectionModel, GridToolbar} from "@mui/x-data-grid";
import {useEffect, useState} from "react";
import axios from "axios";
import {Box, Button, Modal, Typography} from "@mui/material";
import parse from 'html-react-parser';
import void_img from './1400x800.png';
type PlatsDataGridViewProps = {
  //
};

const PlatsDataGridView: React.FC<any> = () => {

    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const[currentRecette,setCurrentRecette]=useState("");
    const[currentPlat,setCurrentPlat]=useState("");
    const[currentPhoto,setCurrentPhoto]=useState("");

    const handleOpen = () => {setOpen(true);}
    const handleClose = () => {
        setOpen(false);
        setCurrentRecette("");
        setCurrentPlat("");
    }


    const handleOpen1 = () => {setOpen1(true);}
    const handleClose1 = () => {
        setCurrentPhoto("");
        setOpen1(false);

    }

    const ModalRecette = () => {
        const style = {
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '0px solid #000',
            borderRadius:"15px",
            boxShadow: 0,
            p: 4,
            outline: 0,
        };

        return(
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Recette du plat ({currentPlat}):
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {parse(currentRecette.replaceAll('-','<br/>'))}
                    </Typography>
                </Box>
            </Modal>
        );
    }

    const ModalImage = () => {
        const style = {
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            border: '0px solid #000',
            borderRadius:"15px",
            boxShadow: 0,
            p: 4,
            outline: 0,
        };

        return(
            <Modal
                open={open1}
                onClose={handleClose1}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>

                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {
                            currentPhoto !== null ?
                                <img alt="" style={{width:"100%" ,height:"350px"}} src={`${process.env.REACT_APP_API_BASE_URL}`+currentPhoto} />
                                :
                                currentPhoto === null &&
                                <img alt="" style={{width:"100%" ,height:"350px"}} src={void_img} />
                        }

                    </Typography>
                </Box>
            </Modal>
        );
    }



    const  handleRecetteRead=(r:any)=> {
      setCurrentRecette(r.recettes)
      setCurrentPlat(r.nom)
      handleOpen();
  }
    const  handlePhotoShow=(r:any)=> {
        setCurrentPhoto(r.photo)
        handleOpen1();
    }

    const [rowSelectionModel, setRowSelectionModel] =
        React.useState<GridRowSelectionModel>([]);

    const[rows,setRows]=useState <any[]> ([]);
    const[columns,setColumns]=useState <GridColDef[]>([]);

    const getPlats=async()=> {

    await axios.get(`${process.env.REACT_APP_API_BASE_URL}/testapp/displayplat/`)
        .then((response) => {

            for (const item of response.data) {
                item.pays=item.pays.nom;
            }
            setRows(response.data);
            const col:GridColDef[]=[]
            for ( const item of Object.keys(response.data[0])){
                switch (item) {
                    case "photo":
                    {
                        col.push(
                            {
                                field: 'photo',
                                headerName: 'Photo',
                                sortable: false,
                                width: 150,
                                renderCell: (params) => (
                                    <Button variant="contained" size="small" onClick={() => handlePhotoShow(params.row)}>
                                        voir
                                    </Button>)
                            },
                        )
                        break;
                    }

                    case "recettes":
                    {
                        col.push(
                            {
                                field: 'recettes',
                                headerName: 'Recette',
                                sortable: false,
                                width: 150,
                                renderCell: (params) => (
                                    <Button variant="contained" size="small" onClick={() => handleRecetteRead(params.row)}>
                                        lire
                                    </Button>)
                            },
                        )
                        break;
                    }

                    default:{
                        col.push( {
                            field: item,
                            headerName: item.toUpperCase(),
                            minWidth: 250,
                            editable: false,
                            flex: 1,

                        },)
                        break;

                    }



                }



            }

            setColumns(col);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  }



  useEffect(() => {
    getPlats();

  },[]);



  return (
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 25,
                },
              },
            }}
            slots={{ toolbar: GridToolbar }}

            pageSizeOptions={[25,50,75,100]}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
              console.log(newRowSelectionModel)
            }}
            rowSelectionModel={rowSelectionModel}

        />
          <ModalRecette/>

          <ModalImage/>
      </Box>
  );
};

export default PlatsDataGridView;
