<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 27.04.2016
     * Time: 20:50
     */

    namespace print3d;


    class FilamentType implements \JsonSerializable {
        private $fID;
        private $diameter;
        private $colorname, $colorcode;
        private $price;
        private $saleprice;
        private $available;
        private $weight = 0.00125;
        private $pdo;

        /**
         * FilamentType constructor.
         *
         * @param int    $fID
         * @param float  $diameter
         * @param string $colorname
         * @param string $colorcode
         * @param int    $price
         * @param int    $saleprice
         * @param int    $available
         */
        public function __construct($fID, $diameter, $colorname, $colorcode, $price, $saleprice, $available) {
            $this->fID = $fID;
            $this->diameter = $diameter;
            $this->colorname = $colorname;
            $this->colorcode = $colorcode;
            $this->price = $price;
            if($saleprice == null) $this->saleprice = 0;
            else $this->saleprice = $saleprice;
            $this->available = $available == 1;
            $this->pdo = new PDO_Mysql();
        }

        /**
         * creates a new instance from a specific fID using data from db
         *
         * @param int $fID
         * @return FilamentType
         */
        public static function fromFID($fID) {
            $pdo = new PDO_Mysql();
            $res = $pdo->query("SELECT * FROM print3d_filamenttypes WHERE fID = :fid", [":fid" => $fID]);
            return new FilamentType($res->fID, $res->diameter, $res->colorname, $res->colorcode, $res->price, $res->salesprice, $res->available);
        }

        /**
         * Returns a array of all filament types in db
         *
         * @return FilamentType[]
         */
        public static function getAllFilaments() {
            $pdo = new PDO_Mysql();
            $stmt = $pdo->queryMulti("SELECT fID FROM print3d_filamenttypes ORDER BY available DESC, colorname");
            return $stmt->fetchAll(\PDO::FETCH_FUNC, "\\print3d\\FilamentType::fromFID");
        }

        /**
         * Returns a array of only available filament types in db
         *
         * @return FilamentType[]
         */
        public static function getAllAvailableFilaments() {
            $pdo = new PDO_Mysql();
            $stmt = $pdo->queryMulti("SELECT fID FROM print3d_filamenttypes WHERE available = 1");
            return $stmt->fetchAll(\PDO::FETCH_FUNC, "\\print3d\\FilamentType::fromFID");
        }

        /**
         * Creates a new Entry in the db
         *
         * @param string $colorname
         * @param string $colorcode
         * @param int    $price
         * @param int    $saleprice
         * @param bool   $active
         * @param int    $diameter
         */
        public static function createNew($colorname, $colorcode, $price, $saleprice, $active, $diameter) {
            $pdo = new PDO_Mysql();
            $pdo->queryInsert("print3d_filamenttypes", [
                "diameter" => $diameter,
                "colorname" => $colorname,
                "colorcode" => $colorcode,
                "price" => $price,
                "salesprice" => $saleprice,
                "available" => $active? 1:0
            ]);
        }

        /**
         * Saves this object to the db
         */
        public function saveChanges() {
            $this->pdo->queryUpdate("print3d_filamenttypes", [
                "diameter" => $this->diameter,
                "colorname" => $this->colorname,
                "colorcode" => $this->colorcode,
                "price" => $this->price,
                "salesprice" => $this->saleprice,
                "available" => $this->available? 1:0
            ], "fID = :fid", [":fid" => $this->fID]);
        }

        /**
         * Calulates the weight of a piece of this filament
         *
         * @param int $length Length of that piece in mm
         * @return float Weight in grams
         */
        public function getWeightFor($length) {
            $radius       = $this->diameter / 2;
            $area         = $radius * $radius * 3.1415926535897932384626433832795;
            return $area * $length * $this->weight;
        }

        /**
         * Calculates the price of a piece of this filament
         *
         * @param int $length Lenght of that piece in mm
         * @return int Price in Cent
         */
        public function getPriceFor($length) {
                return (($this->getWeightFor($length)/1000) * $this->getPrice());
        }

        /**
         * Calulates the energy consumption and cost of a specific time, that the printer is running
         *
         * @param int $time Time in Seconds
         * @return int Price in Cent
         */
        public function getEnergyPrice($time) {
            $time = $time / 60 / 60;
            $kWh = (200 * $time) / 1000;
            return 25 * $kWh;
        }

        /**
         * @return float
         */
        public function getDiameter() {
            return $this->diameter;
        }

        /**
         * @param float $diameter
         */
        public function setDiameter($diameter) {
            $this->diameter = $diameter;
        }

        /**
         * @return string
         */
        public function getColorname() {
            return $this->colorname;
        }

        /**
         * @param string $colorname
         */
        public function setColorname($colorname) {
            $this->colorname = $colorname;
        }

        /**
         * @return string
         */
        public function getColorcode() {
            return $this->colorcode;
        }

        /**
         * @param string $colorcode
         */
        public function setColorcode($colorcode) {
            $this->colorcode = $colorcode;
        }

        /**
         * @return int
         */
        public function getPrice() {
            if($this->saleprice != 0) return $this->saleprice;
            else return$this->price;
        }

        /**
         * @param int $price
         */
        public function setPrice($price) {
            $this->price = $price;
        }

        /**
         * @return int
         */
        public function getSaleprice() {
            return $this->saleprice;
        }

        /**
         * @param int $saleprice
         */
        public function setSaleprice($saleprice) {
            $this->saleprice = $saleprice;
        }

        /**
         * @param bool $available
         */
        public function setAvailable($available) {
            $this->available = $available;
        }

        /**
         * @return bool
         */
        public function isAvailable() {
            return $this->available;
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
                "fID" => $this->fID,
                "colorname" => $this->getColorname(),
                "colorcode" => str_replace("#", "", $this->getColorcode()),
                "price" => $this->price,
                "pricesale" => $this->saleprice,
                "diameter" => $this->diameter,
                "active" => $this->available
            ];
        }
    }