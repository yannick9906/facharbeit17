<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 27.04.2016
     * Time: 20:49
     */

    namespace print3d;


    class User implements \JsonSerializable {
        private $uID;
        private $username;
        private $passwdHash;
        private $email;
        private $realname;
        private $role;
        private $emails;
        private $endpoints;
        private $pdo;

        /**
         * User constructor.
         *
         * @param int    $uID
         * @param string $username
         * @param string $passwdHash
         * @param string $email
         * @param string $realname
         * @param int    $role
         * @param int    $emails
         */
        public function __construct($uID, $username, $passwdHash, $email, $realname, $role, $emails, $endpoints) {
            $this->uID = $uID;
            $this->username = $username;
            $this->passwdHash = $passwdHash;
            $this->email = $email;
            $this->realname = $realname;
            $this->role = $role;
            $this->emails = $emails == 1;
            $this->endpoints = json_decode($endpoints);
            $this->pdo = new PDO_Mysql();
        }

        /**
         * creates a new instance from a specific uID using data from db
         *
         * @param int $uID
         * @return User
         */
        public static function fromUID($uID) {
            $pdo = new PDO_Mysql();
            $res = $pdo->query("SELECT * FROM print3d_user WHERE uID = :uid", [":uid" => $uID]);
            return new User($res->uID, $res->username, $res->passwd, $res->email, $res->realname, $res->level, $res->emails, $res->pushkey);
        }

        /**
         * creates a new instance from a specific username using data from db
         *
         * @param string $name
         * @return User
         */
        public static function fromUName($name) {
            $pdo = new PDO_Mysql();
            $res = $pdo->query("SELECT * FROM print3d_user WHERE username = :uname", [":uname" => $name]);
            return new User($res->uID, $res->username, $res->passwd, $res->email, $res->realname, $res->level, $res->emails, $res->pushkey);
        }

        /**
         * checks if a username is already in the user db
         *
         * @param $uName string Username
         * @return bool
         */
        public static function doesUserNameExist($uName) {
            $pdo = new PDO_Mysql();
            $res = $pdo->query("SELECT * FROM print3d_user WHERE username = :uname", [":uname" => $uName]);
            return isset($res->uID);
        }
        /**TODO
         * Returns all users as a array of Userobjects from db
         *
         * @return User[]
         */
        public static function getAllUsers() {
            $pdo = new PDO_Mysql();
            $stmt = $pdo->queryMulti('SELECT uID FROM print3d_user ');
            return $stmt->fetchAll(PDO::FETCH_FUNC, "\\print3d\\User::fromUID");
        }

        /**
         * Deletes a user
         *
         * @return bool
         */
        public function delete() {
            return $this->pdo->query("DELETE FROM print3d_user WHERE uID = :uid", [":uid" => $this->uID]);
        }

        /**
         * Saves the Changes made to this object to the db
         */
        public function saveChanges() {
            $this->pdo->queryUpdate("print3d_user", [
                "email" => $this->email,
                "passwd" => $this->passwdHash,
                "username" => $this->username,
                "level" => $this->role,
                "realname" => $this->realname,
                "emails" => $this->emails ? 1:0,
                "pushkey" => json_encode($this->endpoints)
                ],
                "uID = :uid", [":uid" => $this->uID]);
        }

        /**
         * Creates a new user from the give attribs
         *
         * @param string $username   Username
         * @param string $email      Email Adress
         * @param string $passwdhash md5 Hash of Password
         * @param string $realname   Users real name
         * @return User The new User as an Object
         */
        public static function createUser($username, $email, $passwdhash, $realname) {
            $pdo = new PDO_Mysql();
            $pdo->queryInsert("print3d_user", [
                "username" => $username,
                "email" => $email,
                "passwd" => $passwdhash,
                "realname" => $realname,
                "pushkey" => "[]"
            ]);
            return self::fromUName($username);
        }

        /**
         * Checks a users session and logs him in, also printing some debug data if requested
         *
         * @return bool|User
         */
        public static function checkSession() {
            session_start();
            if(!isset($_SESSION["uID"])) {
                echo json_encode(["success" => false, "error" => "NoLogin"]);
                exit;
            } else {
                $user = User::fromUID($_SESSION["uID"]);
                if($_GET["m"] == "debug") {
                    echo "<pre style='display: block; position: absolute'>\n";
                    echo "[0] Perm Array Information:\n";
                    echo "Not available on this platform";
                    echo "\n[1] Permission Information:\n";
                    echo "Not available on this platform";
                    echo "\n[2] User Information:\n";
                    echo json_encode($user->toString());
                    echo "\n[3] Client Information:\n";
                    echo "    Arguments: ".$_SERVER["REQUEST_URI"]."\n";
                    echo "    Req Time : ".$_SERVER["REQUEST_TIME"]."ns\n";
                    echo "    Remote IP: ".$_SERVER["REMOTE_ADDR"]."\n";
                    echo "    Usr Agent: ".$_SERVER["HTTP_USER_AGENT"]."\n";
                    echo "</pre>\n";
                }
                return $user;
            }
        }

        /**
         * @return int
         */
        public function getUID() {
            return $this->uID;
        }

        /**
         * @return string
         */
        public function getUsername() {
            return $this->username;
        }

        /**
         * @param string $hash
         * @return bool
         */
        public function comparePassHash($hash) {
            return $hash == $this->passwdHash;
        }

        /**
         * @return string
         */
        public function getEmail() {
            return $this->email;
        }

        /**
         * @return string
         */
        public function getRealname() {
            return $this->realname;
        }

        /**
         * @return int
         */
        public function getRole() {
            return $this->role;
        }

        /**
         * @param string $username
         */
        public function setUsername($username) {
            $this->username = $username;
        }

        /**
         * @param string $new
         */
        public function setPasswdHash($new) {
            $this->passwdHash = $new;
        }

        /**
         * @param string $email
         */
        public function setEmail($email) {
            $this->email = $email;
        }

        /**
         * @param string $realname
         */
        public function setRealname($realname) {
            $this->realname = $realname;
        }

        /**
         * @param int $role
         */
        public function setRole($role) {
            $this->role = $role;
        }

        /**
         * @return bool
         */
        public function canReceiveEmails() {
            return $this->emails;
        }

        /**
         * @param bool $emails
         */
        public function setReceivingEmails($emails) {
            $this->emails = $emails;
        }

        public function addEndpoint($endpoint) {
            require_once "Util.php";
            array_push($this->endpoints, $endpoint);
            Util::sendPushNotification($endpoint);
        }

        public function getEndpoints() {
            return $this->endpoints;
        }

        /**
         * Specify data which should be serialized to JSON
         *
         * @link  http://php.net/manual/en/jsonserializable.jsonserialize.php
         * @return mixed data which can be serialized by <b>json_encode</b>,
         * which is a value of any type other than a resource.
         * @since 5.4.0
         */
        function jsonSerialize() {
            return [
                "uID" => $this->uID,
                "usrname" => $this->username,
                "email" => $this->email,
                "role" => $this->role,
                "realname" => $this->realname,
                "emails" => $this->emails
            ];
        }
    }