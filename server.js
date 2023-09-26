import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
const app = express();
const port = process.env.PORT || 4000;

//Access json data

app.use(bodyParser.json());

app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});
// sql database connection;
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'SatheeshVj&74',
    database: 'Crud',
});

connection.connect((error) => {
    if (error) {
        console.error('Error connecting to MySQL:', error);
    } else {
        console.log('MySQL database is connected successfully');
    }
});

//Get  the AllData from database;

    app.get('/get', function (req, res) {
        const sqlQuery = "SELECT * FROM user";
        
        connection.query(sqlQuery, (error, results) => {
            if (error) {
                return res.status(404).json({ error: 'Error fetching records' });
            } else {
                return res.status(200).json(results);
            }
        });
    });

    //insert API;

    app.post('/insert',function(req,res){
        const { firstName,lastName,age }= req.body;
        const insert = "INSERT INTO user (firstName, lastName, age) VALUES (?, ?, ?)";
        connection.query(insert,[firstName,lastName,age],(error,results)=>{
            if (error) {
                return res.status(403).json({ error: 'Error inserting record' });
            } else {
                return res.status(200).json({ message: "Successfully inserted" });
            }
            

        })

    });

//update API;

    app.put('/update/:id', function (req, res) {
        const { firstName, lastName, age } = req.body;
        const getId = req.params.id;
        const checkID = 'SELECT * FROM user WHERE id = ?';
        connection.query(checkID, [getId], (idErr, idResult) => {
            if (idErr) {
                return res.status(404).json({ error: "Error" });
            }  else {
                const updateQuery = 'UPDATE user SET firstName = ?, lastName = ?, age = ? WHERE id = ?';
                connection.query(updateQuery, [firstName, lastName, age, getId], (updateErr, SuccessUpdate) => {
                    if (updateErr) {
                        res.status(404).json({ error: "Error" });
                    } else {
                        res.status(200).json({ message: "Successfully updated" });
                    }
                });
            }
        });
    });

    //Delete API;

    app.delete('/delete/:id',function(req,res){
        const ID = req.params.id;
        const getquery = 'SELECT * FROM user WHERE id = ?';
        connection.query(getquery,[ID],(queryError,result)=>{
            if(queryError){
                return res.status(404).json({ error:"error"});
            } else if(result.length ===0){
                res.status(303).json({
                    error:"Id is not found"
                })
            } else{
                const deleteQuery = 'DELETE FROM user WHERE id = ?';
                connection.query(deleteQuery,[ID],(deleteErr,deleteResult)=>{
                    if(deleteResult){
                        res.status(200).json({ message:"succefully deleted"});
                        const Reorganize = 'ALTER TABLE user AUTO_INCREMENT = 1';
                        connection.query(Reorganize,(req,res)=>{
                            return res.status(200).json({Reorganize})
                        })
                    } else{
                        res.status(444).json({ message:"error"});

                    }
                })
            }

        })
    })

      
  

