<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-04-25
     * Time: 02:10 AM
     */

    ini_set("display_errors", "on");
    error_reporting(E_ALL & ~E_NOTICE);

    require_once '../../classes/PDO_Mysql.php'; //DB Anbindung
    require_once '../../classes/User.php';
    require_once '../../classes/Util.php';
    require_once '../../classes/Order.php';
    require_once '../../classes/FilamentType.php';

    $user = \print3d\User::checkSession();
    $pdo = new \print3d\PDO_Mysql();

    $orders = ["success" => true];
    if($_GET["type"] == "new") $orders["orders"] = \print3d\Order::getAllOrdersPerUser($user);
    else if($_GET["type"] == "old") $orders["orders"] = \print3d\Order::getAllOldOrdersPerUser($user);
    echo json_encode($orders);