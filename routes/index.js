const express = require('express');
const db = require('../database').db;
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {asyncHandler} = require('../middleware/async-handler');



router.post('/create',asyncHandler(async (req, res) => {

    const {
        nome, indirizzo, cap, città, regione, provincia, note, email, telefono, telefonoReferente, nomeReferente, cliente, compra, buste, sfuso, contattato, ultimoContatto
    } = req.body

    db.query(
        'INSERT INTO shops (nome, indirizzo, cap, città, regione, provincia, note, email, telefono, telefono_referente, nome_referente, cliente, compra, buste, sfuso, contattato, ultimo_contatto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [nome, indirizzo, cap, città, regione, provincia, note, email, telefono, telefonoReferente, nomeReferente, cliente, compra, buste, sfuso, contattato, ultimoContatto], (err, result) => {
            if (err) {
                if (!req.body.nome) {
                    console.log(err.sqlMessage)
                    res.status(400).send(err.sqlMessage)
                } else {
                    console.log(err)
                    res.status(500).send(err)
                }
            } else {
                console.log('values inserted')
                res.status(201).send(result)
            }
        }
    )
}));

router.get('/shops/:place', asyncHandler(async (req, res) => {
    
    const place = req.params.place;

    db.query(
        'SELECT * FROM shops WHERE provincia = ?', place, (err, result) => {
            if (err) {
                console.log(err.sqlMessage);
                res.send(err);
            } else {
                res.status(200).send(result);
            }
        }
    )
}))

router.get('/shop/:id', asyncHandler(async (req, res) => {

    const id = req.params.id;

    db.query(
        'SELECT * FROM shops WHERE id = ?', id, (err, result) => {
            if (err) {
                console.log(err.sqlMessage);
                res.send(err);
            } else if (result.length === 0) {
                res.status(404).send('Shop not found')
            } else {
                res.status(200).send(result);
            }
        }
    )
}))


router.get('/search', asyncHandler( async (req, res) => {

    const query = req.query.query;

    db.query(
        'SELECT * FROM shops WHERE nome LIKE "%' + query + '%" OR indirizzo LIKE "%' + query + '%" OR cap = ? OR città = ? OR provincia = ? OR regione = ? OR email = ? OR telefono = ? OR telefono_referente = ? OR note  = ?',
        [query, query, query, query, query, query, query, query, query, query], (err, result) => {
            if (err) {
                console.log(err.sqlMessage);
                res.send(err);
            } else if (result.length === 0) {
                res.status(404).send('Nothing found')
            } else {
                res.status(200).send(result);
            }
        }
    )
}))


router.get('/advsearch/:orderBy/:direction', asyncHandler( async (req, res) => {
    let dbQuery = 'SELECT * FROM shops WHERE 1=1';
    let inputs = [];

    if (req.query.nome) {
        dbQuery += ' AND nome LIKE "%' + req.query.nome + '%"';
        inputs.push(req.query.nome);
    }
    if (req.query.indirizzo) {
        dbQuery += ' AND indirizzo LIKE "%' + req.query.indirizzo + '%"';
        inputs.push(req.query.indirizzo);
    }
    if (req.query.cap) {
        dbQuery += ' AND cap = ?';
        inputs.push(req.query.cap);
    }
    if (req.query.città) {
        dbQuery += ' AND città = ?';
        inputs.push(req.query.città);
    }
    if (req.query.provincia) {
        dbQuery += ' AND provincia = ?';
        inputs.push(req.query.provincia);
    }
    if (req.query.regione) {
        dbQuery += ' AND regione = ?';
        inputs.push(req.query.regione);
    }
    if (req.query.email) {
        dbQuery += ' AND email = ?';
        inputs.push(req.query.email);
    }
    if (req.query.telefono) {
        dbQuery += ' AND telefono LIKE "%' + req.query.telefono + '%"';
        inputs.push(req.query.telefono);
    }
    if (req.query.telefonoReferente) {
        dbQuery += ' AND telefonoReferente LIKE "%' + req.query.telefonoReferente + '%"';
        inputs.push(req.query.telefonoReferente);
    }
    if (req.query.contattato) {
        contattato = parseInt(req.query.contattato);
        dbQuery += ` AND contattato = ${contattato}`;
        inputs.push(contattato);
    }
    if (req.query.riContattato) {
        riContattato = parseInt(req.query.riContattato)
        dbQuery += ` AND riContattato = ${riContattato}`;
        inputs.push(riContattato);
    }
    if (req.query.compra) {
        compra = parseInt(req.query.compra)
        dbQuery += ` AND compra = ${compra}`;
        inputs.push(compra);
    }
    if (req.query.imbustato) {
        imbustato = parseInt(req.query.imbustato)
        dbQuery += ` AND imbustato = ${imbustato}`;
        inputs.push(imbustato);
    }
    if (req.query.sfuso) {
        sfuso = parseInt(req.query.sfuso)
        dbQuery += ` AND sfuso = ${sfuso}`;
        inputs.push(sfuso);
    }
    if (req.query.note) {
        dbQuery += ' AND note LIKE "%' + req.query.note + '%"';
        inputs.push(req.query.note);
    }

    dbQuery += ` ORDER BY ${req.params.orderBy} ${req.params.direction}`;
    inputs.push(req.params.orderBy, req.params.direction);

    db.query(dbQuery, inputs, (err, result) => {
            if (err) {
                console.log(err.sqlMessage);
                res.send(err);
            } else if (result.length === 0) {
                res.status(404).send('Nothing found')
            } else {
                res.status(200).send(result);
            }
        }
    )
}))

router.delete('/shop/:id', asyncHandler( async (req, res) => {

    const id = req.params.id;

    db.query(
        'DELETE FROM orders_history WHERE shop_id = ?', id, (err, result) => {
            if (err) {
                console.log(err.sqlMessage);
                res.send(err);
            } else {
                res.status(204);
            }
        }
    )

    db.query(
        'DELETE FROM shops WHERE id = ?', id, (err, result) => {
            if (err) {
                console.log(err.sqlMessage);
                res.send(err);
            } else {
                res.status(204).send('Shop Deleted')
            }
        }
    )
}))

router.put('/shop/:id', asyncHandler( async (req, res) => {

    const id = req.params.id;

    const {
        nome, indirizzo, cap, città, provincia, regione, email, telefono, telefonoReferente, nomeReferente, contattato, ultimoContatto, compra, cliente, buste, sfuso, note
    } = req.body

    db.query(
        'UPDATE shops SET nome = ?, indirizzo = ?, cap = ?, città = ?, provincia = ?, regione = ?, email = ?, telefono = ?, telefono_referente = ?, nome_referente = ?, contattato = ?, ultimo_contatto = ?, compra = ?, cliente = ?, buste = ?, sfuso = ?, note = ? WHERE id = ?',
        [nome, indirizzo, cap, città, provincia, regione, email, telefono, telefonoReferente, nomeReferente, contattato, ultimoContatto, compra, cliente, buste, sfuso, note, id], (err, result) => {
            if (err) {
                console.log(err)
                if (!req.body.nome) {
                    console.log(err.sqlMessage)
                    res.status(400).send(err.sqlMessage)
                } else {
                    console.log(err)
                    res.status(500).send(err)
                }
            } else {
                console.log('values inserted')
                res.status(201).send('values inserted')
            }
        }
    )

}))

router.post('/createuser', asyncHandler( async (req, res) => {
    const {
        username, password
    } = req.body

    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    db.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, encryptedPassword], (err, result) => {
            if (err) {
                if (!username && !password) {
                    console.log(err.sqlMessage)
                    res.status(400).send(err.sqlMessage)
                } else {
                    console.log(err)
                    res.status(500).send(err)
                }
            } else {
                console.log('values inserted')
                res.status(201).send('values inserted')
            }
        }
    )
}))

router.delete('/deleteuser/:id', asyncHandler( async (req, res) => {

    const id = req.params.id;

    db.query(
        'DELETE FROM users WHERE id = ?', id, (err, result) => {
            if (err) {
                console.log(err.sqlMessage);
                res.send(err);
            } else {
                res.status(204).send('User Deleted')
            }
        }
    )
}))

router.get('/user', asyncHandler( async (req, res) => {

    const username = req.query.username;
    const password = req.query.password;
    const encryptedPassword = await bcrypt.hash(password, saltRounds);
    
    db.query(
        'SELECT * FROM users WHERE username = ?', [username], (err, result) => {
            if (err) {
                console.log(err.sqlMessage);
                res.send(err);
            } else if (result.length === 0) {
                res.status(404).send('User not found')
            } else {
                const authenticated = bcrypt.compareSync(password, result[0].password);
                if (authenticated) {
                    res.status(200).send(result[0]);
                } else {
                    res.status(401).send('Access Denied');
                }
                
            }
        }
    )

}))

router.post('/orders-history', asyncHandler( async (req, res) => {

    const { shopId, orderDate, invoiceCode, invoiceDate } = req.body

    db.query(
        'INSERT INTO orders_history (shop_id, order_date, invoice_code, invoice_date) VALUES (?, ?, ?, ?)',
        [shopId, orderDate, invoiceCode, invoiceDate], (err, result) => {
            if (err) {
                if (!shopId) {
                    console.log(err.sqlMessage)
                    res.status(400).send(err.sqlMessage)
                } else {
                    console.log(err)
                    res.status(500).send(err)
                }
            } else {
                console.log('values inserted')
                res.status(201).send(result)
            }
        }
    )

}))

router.get('/orders-history/:id', asyncHandler( async (req, res) => {
    
    const id = req.params.id;

    db.query(
        'SELECT * FROM orders_history WHERE shop_id = ?', id, (err, result) => {
            if (err) {
                console.log(err.sqlMessage);
                res.send(err);
            } else if (result.length === 0) {
                res.status(404).send('Orders not found')
            } else {
                res.status(200).send(result);
            }
        }
    )

}))

router.get('/clients-list/:orderBy/:direction', asyncHandler( async (req, res) => {

    const orderBy = req.params.orderBy;
    const direction = req.params.direction;

    db.query(
        `SELECT * FROM shops WHERE cliente = ? ORDER BY ${orderBy} ${direction}`, 1, (err, result) => {
            if (err) {
                console.log(err.sqlMessage);
                res.send(err);
            } else if (result.length === 0) {
                res.status(404).send('No Shop found')
            } else {
                res.status(200).send(result);
            }
        }
    )

}))

router.get('/last-added/:limit', asyncHandler( async (req, res) => {

    const limit = req.params.limit;

    db.query(
        `SELECT * FROM shops ORDER BY created_at DESC LIMIT ${limit}`, (err, result) => {
            if (err) {
                console.log(err.sqlMessage);
                res.send(err);
            } else if (result.length === 0) {
                res.status(404).send('No Shop found')
            } else {
                res.status(200).send(result);
            }
        }
    )

}))

module.exports = router;