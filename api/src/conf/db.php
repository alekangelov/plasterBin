<?php
    class Database{
        // private $dbhost = 'localhost';
        // private $dbuser = 'root';
        // private $dbpassword = '';
        // private $dbname = 'alek_plaster';
        
        public function connect(){
            $conn = "mysql:host=$this->dbhost;dbname=$this->dbname";
            $dbConnection = new PDO($conn, $this->dbuser, $this->dbpassword);
            $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $dbConnection;
        }
    }