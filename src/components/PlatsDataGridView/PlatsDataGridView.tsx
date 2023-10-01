import * as React from "react";
import {DataGrid, GridColDef, GridRowSelectionModel, GridToolbar} from "@mui/x-data-grid";
import {useEffect, useState} from "react";
import axios from "axios";
import {Box, Button} from "@mui/material";

type PlatsDataGridViewProps = {
  //
};

const PlatsDataGridView: React.FC<any> = () => {
  const [rowSelectionModel, setRowSelectionModel] =
      React.useState<GridRowSelectionModel>([]);

  const[rows,setRows]=useState <any[]> ([]);
  const[columns,setColumns]=useState <GridColDef[]>([]);

  const  handleButtonClick=(id:any)=> {
        alert(id)
  }
  const getPlats=async()=> {

    await axios.get(`${process.env.REACT_APP_API_BASE_URL}/testapp/displayplat/`)
        .then((response) => {

            for (const item of response.data) {
                item.pays=item.pays.nom;
            }
            setRows(response.data);
            const col:GridColDef[]=[]
            for ( const item of Object.keys(response.data[0])){
                if(item==="recettes"){
                    col.push(
                        {
                            field: 'button',
                            headerName: 'Recette',
                            sortable: false,
                            width: 150,
                            renderCell: (params) => (
                                <Button variant="contained" size="small" onClick={() => handleButtonClick(params.row.id)}>
                                    lire
                                </Button>)
                        },
                    )
                }
                else{
                    col.push( {
                        field: item,
                        headerName: item.toUpperCase(),
                        minWidth: 250,
                        editable: false,
                        flex: 1,

                    },)
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
      </Box>
  );
};

export default PlatsDataGridView;
