import React, { useEffect, useState} from "react";
import { listarBicicletas, agregarBicicleta, editarBicicleta, borrarBicicleta } from "../../api/bicicletas";

const BicicletasPage = () => {
    const [bicicletas, setBicicletas] = useState([]);
    const [formData, setFormData] = useState({ nombre_bicicleta: "", estado: ""});
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showInputs, setShowInputs] = useState(false);

    // Listar bicicletas al cargar la pagina
    useEffect(() => {
        const fetchBicicletas = async () => {
            try {
                const data = await listarBicicletas();
                setBicicletas(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchBicicletas();
    }, []);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value});
    };

    // Manejar el envio del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           if(editMode){
                await editarBicicleta(editId, formData);
                setEditMode(false);
                setEditId(null);
           } else{
                await agregarBicicleta(formData);
           }
           setFormData({ nombre_bicicleta: "", estado: "" });
           const data = await listarBicicletas();
           setBicicletas(data);
        } catch (error) {
            console.error(error);
        }
    };

    // Manejar edicion
    const handleEdit = (bicicleta) => {
        setFormData({ nombre_bicicleta: bicicleta.nombre_bicicleta, estado: bicicleta.estado});
        setEditMode(true);
        setEditId(bicicleta.id_bicicleta);
        setShowInputs(true);
    };

    // manejar borrado
    const handleDelete = async (id) => {
        try {
            await borrarBicicleta(id);
            const data = await listarBicicletas();
            setBicicletas(data);
        } catch (error) {
            console.error(error);
        }
    };

    // Mostrar inputs para agregar nueva bicicleta
    const handleShowInputs = () => {
        setFormData({ nombre_bicicleta: "", estado: ""});
        setEditMode(false);
        setShowInputs(true);
    };

    return(
        <div>
            <h1>Gestion de Bicicletas</h1>
            {showInputs ? (
                <form onSubmit={handleSubmit}>
                    <input type="text" name="nombre_bicicleta" placeholder="Nombre de la bicicleta" value={formData.nombre_bicicleta} onChange={handleChange} required/>
                    <input type="text" name="estado" placeholder="Estado (libre/ocupada)" value={formData.estado} onChange={handleChange} required/>
                    <button type="submit">{editMode ? "Guardar Cambios" : "Agregar Bicicleta"}</button>
                </form>
            ) : (
                <button onClick={handleShowInputs}>Agregar Nuvea Bicicleta</button>
            )}

            <h2>Lista de Bicicletas</h2>
            <ul>
                {bicicletas.map((bicicleta) => (
                    <li key={bicicleta.id_bicicleta}>
                        <p>
                            {bicicleta.nombre_bicicleta} - {bicicleta.estado}
                        </p>
                        <button onClick={() => handleEdit(bicicleta)}>Editar</button>
                        <button onClick={() => handleDelete(bicicleta.id_bicicleta)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BicicletasPage;