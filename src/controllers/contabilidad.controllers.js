const pool = require('../db');

const obtenerTodasContabilidades = async (req,res,next)=> {
    try {
        const todasZonas = await pool.query("select documento_id, razon_social, activo from mad_usuariocontabilidad order by razon_social");
        res.json(todasZonas.rows);
    }
    catch(error){
        console.log(error.message);
    }
    //res.send('Listado de todas los zonas');
};
const obtenerContabilidad = async (req,res,next)=> {
    try {
        const {id} = req.params;
        const result = await pool.query("select * from mad_usuariocontabilidad where documento_id = $1",[id]);

        if (result.rows.length === 0)
            return res.status(404).json({
                message:"Contabilidad no encontrada"
            });

        res.json(result.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
};

const crearContabilidad = async (req,res,next)=> {
    const { id_usuario,     //correo anfitrion
            documento_id,   //contabilidad
            razon_social,   //contabilidad
            idplan
            } = req.body
    try {
        let strSQL;
        strSQL = "INSERT INTO mad_usuariocontabilidad";
        strSQL = strSQL + " (";
        strSQL = strSQL + " id_usuario,documento_id,razon_social,activo,id_plan";
        strSQL = strSQL + " )";
        strSQL = strSQL + " VALUES ($1,$2,$3,'1',$4)"; 
        strSQL = strSQL + " RETURNING *";
        const result = await pool.query(strSQL, 
        [   
            id_usuario,
            documento_id,
            razon_social,
            idplan        ]
        );
        res.json(result.rows[0]);
    }catch(error){
        //res.json({error:error.message});
        next(error)
    }
};

const eliminarContabilidad = async (req,res,next)=> {
    try {
        const {id_usuario, documento_id} = req.params;
        const result = await pool.query("delete from mad_usuariocontabilidad where id_usuario = $1 and documento_id = $2",[id_usuario,documento_id]);

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Contabilidad no encontrada"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }

};
const actualizarContabilidad = async (req,res,next)=> {
    try {
        const {id_usuario, documento_id} = req.params;
        const {razon_social,activo} = req.body
 
        const result = await pool.query("update mad_usuariocontabilidad set razon_social=$1,activo=$2 where id_usuario=$3 and documento_id=$4",[razon_social,activo,id_usuario,documento_id]);

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Contabilidad no encontrada"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    obtenerTodasContabilidades,
    obtenerContabilidad,
    crearContabilidad,
    eliminarContabilidad,
    actualizarContabilidad
 }; 