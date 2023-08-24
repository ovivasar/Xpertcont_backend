const pool = require('../db');

const obtenerTodosAsientos = async (req,res,next)=> {
    //Solo Cabeceras
    const {id_usuario, ano, mes, id_libro} = req.params;

    let strSQL;
    strSQL = "SELECT ano";
    strSQL = strSQL + " ,mes";
    strSQL = strSQL + " ,id_libro";
    strSQL = strSQL + " ,num_asiento";
    strSQL = strSQL + " ,cast(fecha_asiento as varchar)::varchar(50) as fecha_asiento";
    strSQL = strSQL + " ,glosa";
    strSQL = strSQL + " ,r_documento_id";
    strSQL = strSQL + " ,(r_cod";                                           //comprobante
    strSQL = strSQL + "   || '-' || r_serie";                               //comprobante
    strSQL = strSQL + "   || '-' || r_numero)::varchar(50) as comprobante"; //comprobante
    strSQL = strSQL + " ,cast(r_fecemi as varchar)::varchar(50) as r_fecemi";
    strSQL = strSQL + " ,(r_cod_ref";                                           //comprobante_ref
    strSQL = strSQL + "   || '-' || r_serie_ref";                               //comprobante_ref
    strSQL = strSQL + "   || '-' || r_numero_ref)::varchar(50) as comprobante_ref"; //comprobante_ref

    strSQL = strSQL + " FROM";
    strSQL = strSQL + " mct_asientocontable ";
    strSQL = strSQL + " WHERE id_usuario = '" + id_usuario + "'";
    strSQL = strSQL + " AND ano = '" + ano + "'";
    strSQL = strSQL + " AND mes = '" + mes + "'";
    strSQL = strSQL + " AND id_libro = '" + id_libro + "'";
    strSQL = strSQL + " ORDER BY num_asiento DESC";

    try {
        const todosReg = await pool.query(strSQL);
        res.json(todosReg.rows);
    }
    catch(error){
        console.log(error.message);
    }

    //res.send('Listado de todas los zonas');
};

const obtenerTodosAsientosPlan = async (req,res,next)=> {
    //Modo Detalles 
    //Version analizado, util para formato excel
    const {id_usuario, ano, mes, id_libro} = req.params;

    let strSQL;
    strSQL = "SELECT mct_asientocontabledet.ano";
    strSQL = strSQL + " ,mct_asientocontabledet.mes";
    strSQL = strSQL + " ,mct_asientocontabledet.id_libro";
    strSQL = strSQL + " ,mct_asientocontabledet.num_asiento";
    strSQL = strSQL + " ,mct_asientocontabledet.item"; //dato unico en detalle
    strSQL = strSQL + " ,cast(mct_asientocontabledet.fecha_asiento as varchar)::varchar(50) as fecha_asiento";
    strSQL = strSQL + " ,mct_asientocontabledet.glosa";

    strSQL = strSQL + " ,mct_asientocontabledet.r_documento_id";
    strSQL = strSQL + " ,(mct_asientocontabledet.r_cod";                                           //comprobante
    strSQL = strSQL + "   || '-' || mct_asientocontabledet.r_serie";                               //comprobante
    strSQL = strSQL + "   || '-' || mct_asientocontabledet.r_numero)::varchar(50) as comprobante"; //comprobante
    strSQL = strSQL + " ,cast(mct_asientocontabledet.r_fecemi as varchar)::varchar(50) as r_fecemi";
    strSQL = strSQL + " ,(mct_asientocontabledet.r_cod_ref";                                           //comprobante_ref
    strSQL = strSQL + "   || '-' || mct_asientocontabledet.r_serie_ref";                               //comprobante_ref
    strSQL = strSQL + "   || '-' || mct_asientocontabledet.r_numero_ref)::varchar(50) as comprobante_ref"; //comprobante_ref
    
    strSQL = strSQL + " ,mct_asientocontabledet.id_cuenta";
    strSQL = strSQL + " ,mct_cuenta.descripcion";
    strSQL = strSQL + " ,mct_asientocontabledet.debe_nac";
    strSQL = strSQL + " ,mct_asientocontabledet.haber_nac";
    strSQL = strSQL + " ,mct_asientocontabledet.debe_me";
    strSQL = strSQL + " ,mct_asientocontabledet.haber_me";
    strSQL = strSQL + " ,mct_asientocontabledet.tc";

    strSQL = strSQL + " FROM";
    strSQL = strSQL + " mct_asientocontabledet LEFT JOIN mct_cuenta";
    strSQL = strSQL + " ON (mct_asientocontabledet.id_usuario = mct_cuenta.id_usuario and ";
    strSQL = strSQL + "     mct_asientocontabledet.plantilla = mct_cuenta.plantilla and ";
    strSQL = strSQL + "     mct_asientocontabledet.id_cuenta = mct_cuenta.id_cuenta ) ";
    //cuidado diseñar tabla para trabajo por (años) o (plantilla) en caso de cambio contable tributario sunat

    strSQL = strSQL + " WHERE mct_asientocontabledet.id_usuario = '" + id_usuario + "'";
    strSQL = strSQL + " AND mct_asientocontabledet.ano = '" + ano + "'";
    strSQL = strSQL + " AND mct_asientocontabledet.mes = '" + mes + "'";
    strSQL = strSQL + " AND mct_asientocontabledet.id_libro = '" + id_libro + "'";
    strSQL = strSQL + " ORDER BY mct_asientocontabledet.num_asiento DESC";

    try {
        const todosReg = await pool.query(strSQL);
        res.json(todosReg.rows);
    }
    catch(error){
        console.log(error.message);
    }
};

const obtenerAsiento = async (req,res,next)=> {
    try {
        const {cod,serie,num,elem} = req.params;
        let strSQL ;
        
        strSQL = "SELECT ";
        strSQL = strSQL + "  mve_venta.id_empresa";
        strSQL = strSQL + " ,mve_venta.id_punto_venta";
        strSQL = strSQL + " ,mve_venta.tipo_op";
        strSQL = strSQL + " ,mve_venta.id_zona_venta";
        strSQL = strSQL + " ,mve_venta.zona_venta";
        strSQL = strSQL + " ,mve_venta.id_vendedor";
        strSQL = strSQL + " ,mve_venta.vendedor";
        strSQL = strSQL + " ,mve_venta.comprobante_original_codigo";
        strSQL = strSQL + " ,mve_venta.comprobante_original_serie";
        strSQL = strSQL + " ,mve_venta.comprobante_original_numero";
        strSQL = strSQL + " ,mve_venta.elemento";
        strSQL = strSQL + " ,cast(mve_venta.comprobante_original_fecemi as varchar)::varchar(50) as comprobante_original_fecemi";
        strSQL = strSQL + " ,mve_venta.documento_id";
        strSQL = strSQL + " ,mve_venta.razon_social";
        strSQL = strSQL + " ,mad_correntistas.codigo"; 
        strSQL = strSQL + " ,mve_venta.debe";
        strSQL = strSQL + " ,mve_venta.peso_total";
        strSQL = strSQL + " ,mve_venta.registrado";
        strSQL = strSQL + " ,mve_venta.id_formapago";   //new
        strSQL = strSQL + " ,mve_venta.formapago";      //new
        strSQL = strSQL + " ,mve_venta.cond_venta";     //new
        strSQL = strSQL + " ,mve_venta.cond_entrega";   //new
        strSQL = strSQL + " FROM mve_venta LEFT JOIN mad_correntistas";
        strSQL = strSQL + " ON (mve_venta.documento_id = mad_correntistas.documento_id) ";
        
        strSQL = strSQL + " WHERE mve_venta.comprobante_original_codigo = $1";
        strSQL = strSQL + " AND mve_venta.comprobante_original_serie = $2";
        strSQL = strSQL + " AND mve_venta.comprobante_original_numero = $3";
        strSQL = strSQL + " AND mve_venta.elemento = $4";
        //console.log(strSQL);

        const result = await pool.query(strSQL,[cod,serie,num,elem]);

        if (result.rows.length === 0)
            return res.status(404).json({
                message:"Venta no encontrada"
            });

        res.json(result.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
};

const crearAsiento = async (req,res,next)=> {
    let strSQL;
    const { //datos cabecera
        id_usuario,     //01
        ano,            //02
        mes,            //03
        id_libro,       //04
        num_asiento,    //05
        //datos cuerpo 
        glosa,          //06
        r_id_documento, //07
        r_documento_id, //08
        r_condicion,    //09
        r_estado,       //10
        r_cod,          //11
        r_serie,        //12
        r_numero,       //13
        r_fecemi,       //14
        r_fecpagovct,   //15
        r_cod_ref,      //16
        r_serie_ref,    //17
        r_numero_ref,   //18
        r_fecemi_ref,   //19
        r_fecpagovct_ref, //20
        r_cuenta,       //21
        r_id_base,      //22
        r_base001,      //23
        r_base002,      //24
        r_base003,      //25
        r_base004,      //26
        r_igv001,       //27
        r_igv002,       //28
        r_igv003,       //29
        r_monto_otros,  //30
        r_monto_isc,    //31
        r_monto_icbp,   //32
        r_monto_total,  //33
        r_tc,           //34
        //datos compras dolares
        r_base_me,      //35
        r_igv_me,       //36
        r_total_me,     //37
        r_id_bien,      //38
        //datos compras exterior
        r_id_pais,      //39
        r_id_aduana,    //40
        r_ano_dua,      //41
        r_comprobante_nodomic,  //42
        //datos detraccion
        r_detraccion_num,       //43
        r_detraccion_fecemi,    //44
        r_monto_detraccion,     //45
        //datos financiero
        r_id_mediopago,         //46
        r_voucher_banco,        //47
        r_cuenta10,             //48 new efectivo o banco X
    } = req.body;

    //cuando llega con dd/mm/yyyy o dd-mm-yyyy hay que invertir el orden, sino sale invalido
    /*
    let datePieces = comprobante_original_fecemi.split("/");
    const fechaArmada = new Date(datePieces[2],datePieces[1],datePieces[0]); //ok con hora 00:00:00
    sSerie = (fechaArmada.getMonth()+1).toString(); // ok, se aumenta +1, por pinche regla js
    sSerie = sSerie.padStart(2,'0');
    */
    //cuidado con edicion manual de la fecha, se registra al reves, pero en caso de click va normal
    //let datePieces = comprobante_original_fecemi.split("-");
    //const fechaArmada = new Date(datePieces[0],datePieces[1],datePieces[2]); //ok con hora 00:00:00

    strSQL = "INSERT INTO mct_asiento";
    strSQL = strSQL + " (";
    strSQL = strSQL + "  id_usuario";
    strSQL = strSQL + " ,documento_id"; //new
    strSQL = strSQL + " ,ano";
    strSQL = strSQL + " ,mes";
    strSQL = strSQL + " ,id_libro";
    strSQL = strSQL + " ,num_asiento";
    strSQL = strSQL + " ,dia";
    strSQL = strSQL + " ,fecha_asiento";

    strSQL = strSQL + " ,glosa";
    strSQL = strSQL + " ,debe";
    strSQL = strSQL + " ,haber";
    strSQL = strSQL + " ,debe_me";
    strSQL = strSQL + " ,comprobante_original_fecemi";
    strSQL = strSQL + " ,comprobante_original_fecpagovct";
    strSQL = strSQL + " ,documento_id";
    strSQL = strSQL + " ,razon_social";
    strSQL = strSQL + " ,debe";
    strSQL = strSQL + " ,peso_total";
    strSQL = strSQL + " ,registrado";
    strSQL = strSQL + " ,id_formapago";     //new
    strSQL = strSQL + " ,formapago";        //new
    strSQL = strSQL + " ,cond_venta";       //new
    strSQL = strSQL + " ,cond_entrega";     //new
    strSQL = strSQL + " )";
    strSQL = strSQL + " VALUES";
    strSQL = strSQL + " (";
    strSQL = strSQL + "  $1";
    strSQL = strSQL + " ,'" + sAno + "'";
    strSQL = strSQL + " ,$2";
    strSQL = strSQL + " ,$3";
    strSQL = strSQL + " ,$4";
    strSQL = strSQL + " ,$5";
    strSQL = strSQL + " ,$6";
    strSQL = strSQL + " ,$7";
    strSQL = strSQL + " ,'" + sCod + "'";
    strSQL = strSQL + " ,'" + sSerie + "'";
    strSQL = strSQL + " ,(select * from fve_genera_venta_sf(1,'" + sCod + "','" + sSerie + "'))";
    strSQL = strSQL + ",1"; //elemento
    strSQL = strSQL + " ,$8";
    strSQL = strSQL + " ,$8";
    strSQL = strSQL + " ,$9";
    strSQL = strSQL + " ,$10";
    strSQL = strSQL + " ,$11";
    strSQL = strSQL + " ,$12";
    strSQL = strSQL + " ,$13";
    strSQL = strSQL + " ,$14";  //new
    strSQL = strSQL + " ,$15";  //new
    strSQL = strSQL + " ,$16";  //new
    strSQL = strSQL + " ,$17";  //new
    strSQL = strSQL + " ) RETURNING *";
    try {
        console.log(strSQL);
        const result = await pool.query(strSQL, 
        [   
            id_empresa,     //1
            id_punto_venta, //2
            tipo_op,        //3
            id_zona_venta,  //4
            zona_venta,     //5
            id_vendedor,    //6
            vendedor,       //7
            comprobante_original_fecemi, //8
            documento_id,   //9
            razon_social,   //10
            debe,           //11
            peso_total,     //12
            registrado,     //13
            id_formapago,   //14 new
            formapago,      //15 new
            cond_venta,     //16 new
            cond_entrega    //17 new
        ]
        );
        res.json(result.rows[0]);
    }catch(error){
        //res.json({error:error.message});
        next(error)
    }
};

const eliminarAsiento = async (req,res,next)=> {
    try {
        const {id_usuario, ano, mes, id_libro, num_asiento} = req.params;
        var strSQL;
        var result;
        var result2;
        
        //primero eliminar todos detalles
        strSQL = "DELETE FROM mct_asientocontabledet ";
        strSQL = strSQL + " WHERE id_usuario = '" + id_usuario + "'";
        strSQL = strSQL + " AND ano = '" + ano + "'";
        strSQL = strSQL + " AND mes = '" + mes + "'";
        strSQL = strSQL + " AND id_libro = '" + id_libro + "'";
        strSQL = strSQL + " AND num_asiento = '" + num_asiento + "'";

        result = await pool.query(strSQL,[id_usuario,ano,mes,id_libro,num_asiento]);
        /*if (result.rowCount === 0)
            return res.status(404).json({
                message:"Detalle no encontrado"
            });
*/
        //luego eliminar cabecera
        strSQL = "DELETE FROM mct_asientocontable ";
        strSQL = strSQL + " WHERE id_usuario = '" + id_usuario + "'";
        strSQL = strSQL + " AND ano = '" + ano + "'";
        strSQL = strSQL + " AND mes = '" + mes + "'";
        strSQL = strSQL + " AND id_libro = '" + id_libro + "'";
        strSQL = strSQL + " AND num_asiento = '" + num_asiento + "'";
        result2 = await pool.query(strSQL,[id_usuario,ano,mes,id_libro,num_asiento]);
        /*if (result2.rowCount === 0)
            return res.status(404).json({
                message:"Venta no encontrada"
            });
*/
        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }

};
const actualizarAsiento = async (req,res,next)=> {
    try {
        const { //datos cabecera
                id_usuario,     //01
                ano,            //02
                mes,            //03
                id_libro,       //04
                num_asiento,    //05
                //datos cuerpo 
                glosa,          //06
                r_id_documento, //07
                r_documento_id, //08
                r_condicion,    //09
                r_estado,       //10
                r_cod,          //11
                r_serie,        //12
                r_numero,       //13
                r_fecemi,       //14
                r_fecpagovct,   //15
                r_cod_ref,      //16
                r_serie_ref,    //17
                r_numero_ref,   //18
                r_fecemi_ref,   //19
                r_fecpagovct_ref, //20
                r_cuenta,       //21
                r_id_base,      //22
                r_base001,      //23
                r_base002,      //24
                r_base003,      //25
                r_base004,      //26
                r_igv001,       //27
                r_igv002,       //28
                r_igv003,       //29
                r_monto_otros,  //30
                r_monto_isc,    //31
                r_monto_icbp,   //32
                r_monto_total,  //33
                r_tc,           //34
                //datos compras dolares
                r_base_me,      //35
                r_igv_me,       //36
                r_total_me,     //37
                r_id_bien,      //38
                //datos compras exterior
                r_id_pais,      //39
                r_id_aduana,    //40
                r_ano_dua,      //41
                r_comprobante_nodomic,  //42
                //datos detraccion
                r_detraccion_num,       //43
                r_detraccion_fecemi,    //44
                r_monto_detraccion,     //45
                //datos financiero
                r_id_mediopago,         //46
                r_voucher_banco,        //47
                r_cuenta10,             //48 new efectivo o banco X
            } = req.body;
        
        var strSQL;
        strSQL = "UPDATE mct_asientocontable SET ";
        strSQL = strSQL + "  glosa = $6";
        strSQL = strSQL + " ,r_id_documento = $7";
        strSQL = strSQL + " ,r_documento_id = $8";

        strSQL = strSQL + " ,r_cod = $11";
        strSQL = strSQL + " ,r_serie = $12";
        strSQL = strSQL + " ,r_numero = $13";
        strSQL = strSQL + " ,r_fecemi = $14";
        strSQL = strSQL + " ,r_fecpagovct = $15";
        strSQL = strSQL + " ,r_cod_ref = $16";
        strSQL = strSQL + " ,r_serie_ref = $17";
        strSQL = strSQL + " ,r_numero_ref = $18";
        strSQL = strSQL + " ,r_fecemi_ref = $19";
        strSQL = strSQL + " ,r_fecpagovct_ref = $20";
        strSQL = strSQL + " ,r_cuenta = $21";
        strSQL = strSQL + " ,r_id_base = $22";
        strSQL = strSQL + " ,r_base001 = $23";
        strSQL = strSQL + " ,r_base002 = $24";
        strSQL = strSQL + " ,r_base003 = $25";
        strSQL = strSQL + " ,r_base004 = $26";
        strSQL = strSQL + " ,r_igv001 = $27";
        strSQL = strSQL + " ,r_igv002 = $28";
        strSQL = strSQL + " ,r_igv003 = $29";
        strSQL = strSQL + " ,r_monto_otros = $30";
        strSQL = strSQL + " ,r_monto_isc = $31";
        strSQL = strSQL + " ,r_monto_icbp = $32";
        strSQL = strSQL + " ,r_monto_total = $33";
        strSQL = strSQL + " ,r_tc = $34";
        //datos compra me
        strSQL = strSQL + " ,r_base_me = $35";
        strSQL = strSQL + " ,r_igv_me = $36";
        strSQL = strSQL + " ,r_total_me = $37";
        //datos bien
        strSQL = strSQL + " ,r_id_bien = $38";
        //datos compras exterior
        strSQL = strSQL + " ,r_id_pais = $39";
        strSQL = strSQL + " ,r_id_aduana = $40";
        strSQL = strSQL + " ,r_ano_dua = $41";
        strSQL = strSQL + " ,r_comprobante_nodomic = $42";
        //datos detraccion
        strSQL = strSQL + " ,r_detraccion_num = $43";
        strSQL = strSQL + " ,r_detraccion_fecemi = $44";
        strSQL = strSQL + " ,r_monto_detraccion = $45";
        //datos financiero
        strSQL = strSQL + " ,r_id_mediopago = $46";
        strSQL = strSQL + " ,r_voucher_banco = $47";
        strSQL = strSQL + " ,r_cuenta10 = $48";

        strSQL = strSQL + " WHERE id_usuario = $1";
        strSQL = strSQL + " AND ano = $2";
        strSQL = strSQL + " AND mes = $3";
        strSQL = strSQL + " AND id_libro = $4";
        strSQL = strSQL + " AND num_asiento = $5";
 
        const result = await pool.query(strSQL,
        [   
            id_usuario,     //01
            ano,            //02
            mes,            //03
            id_libro,       //04
            num_asiento,    //05
            //datos cuerpo 
            glosa,          //06
            r_id_documento, //07
            r_documento_id, //08
            r_condicion,    //09
            r_estado,       //10
            r_cod,          //11
            r_serie,        //12
            r_numero,       //13
            r_fecemi,       //14
            r_fecpagovct,   //15
            r_cod_ref,      //16
            r_serie_ref,    //17
            r_numero_ref,   //18
            r_fecemi_ref,   //19
            r_fecpagovct_ref, //20
            r_cuenta,       //21
            r_id_base,      //22
            r_base001,      //23
            r_base002,      //24
            r_base003,      //25
            r_base004,      //26
            r_igv001,       //27
            r_igv002,       //28
            r_igv003,       //29
            r_monto_otros,  //30
            r_monto_isc,    //31
            r_monto_icbp,   //32
            r_monto_total,  //33
            r_tc,           //34
            //datos compras dolares
            r_base_me,      //35
            r_igv_me,       //36
            r_total_me,     //37
            //datos bien
            r_id_bien,      //38
            //datos compras exterior
            r_id_pais,      //39
            r_id_aduana,    //40
            r_ano_dua,      //41
            r_comprobante_nodomic,  //42
            //datos detraccion
            r_detraccion_num,       //43
            r_detraccion_fecemi,    //44
            r_monto_detraccion,     //45
            //datos financiero
            r_id_mediopago,         //46
            r_voucher_banco,     //47
            r_cuenta10,             //48 new efectivo o banco X
        ]
        );

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Venta no encontrada"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }
};

const anularAsiento = async (req,res,next)=> {
    try {
        const {cod,serie,num,elem} = req.params;
        var strSQL;
        var result;
        var result2;

        strSQL = "UPDATE mve_venta_detalle SET registrado = 0, estado = 'ANULADO'";
        strSQL = strSQL + " WHERE comprobante_original_codigo = $1";
        strSQL = strSQL + " AND comprobante_original_serie = $2";
        strSQL = strSQL + " AND comprobante_original_numero = $3";
        strSQL = strSQL + " AND elemento = $4";
        result = await pool.query(strSQL,[cod,serie,num,elem]);

        strSQL = "UPDATE mve_venta SET registrado = 0";
        strSQL = strSQL + " WHERE comprobante_original_codigo = $1";
        strSQL = strSQL + " AND comprobante_original_serie = $2";
        strSQL = strSQL + " AND comprobante_original_numero = $3";
        strSQL = strSQL + " AND elemento = $4";
        result2 = await pool.query(strSQL,[cod,serie,num,elem]);

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }

};

module.exports = {
    obtenerTodosAsientos,
    obtenerTodosAsientosPlan,
    obtenerAsiento,
    crearAsiento,
    eliminarAsiento,
    actualizarAsiento,
    anularAsiento
 }; 