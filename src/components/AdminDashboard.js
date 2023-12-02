import React, { useState, useEffect } from "react";
import { Modal, Table, Space, Input } from "antd";
import { deleteUser, getAllUsers, updateUser } from "../apis/users_api";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Loader from "./Loader";

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currRec, setCurrRec] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState("name");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const usersData = await getAllUsers();
      const dataWithKeys = usersData.map((user) => ({
        ...user,
        key: user._id,
      }));
      setData(dataWithKeys);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEdit = async () => {
    setIsModalOpen(false);
    console.log("Edit clicked for:", currRec);
    setLoading(true);
    await updateUser(currRec._id, currRec.name, currRec.role);
    fetchData();
  };

  const handleDeleteAll = async () => {
    try {
      console.log(selectedRowKeys);

      //selectedRowKeys contains userids

      if (selectedRowKeys.length === 0) {
        console.log("No users selected for deletion.");
        return;
      }

      setLoading(true);
      for (const userId of selectedRowKeys) {
        await deleteUser(userId);
      }

      fetchData();
    } catch (error) {
      console.error("Error deleting users", error);
    }
  };

  const handleDelete = async (record) => {
    try {
      console.log("Delete clicked for:", record);
      setLoading(true);
      const data = await deleteUser(record._id);
      fetchData();
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const handleSearch = () => {
    const filteredData = data.filter((record) =>
      record[selectedColumn].toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredData(filteredData);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md sm:px-6 lg:px-8"
            onClick={() => {
              setIsModalOpen(true);
              setCurrRec(record);
            }}
          >
            <EditOutlined />
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md sm:px-6 lg:px-8"
            onClick={() => handleDelete(record)}
          >
            <DeleteOutlined />
          </button>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };

  return (
    <div>
      <div className="md:flex md:justify-between md:mx-5 p-5">
        <div className="mb-2 md:mb-0 md:flex items-center overflow-auto max-w-full">
          <select
            className="w-full md:w-auto max-w-sm md:max-w-md px-4 py-2 text-base md:text-sm border rounded-md mb-2 md:mb-0 md:mr-2 focus:outline-none focus:border-blue-500"
            onChange={(e) => setSelectedColumn(e.target.value)}
            value={selectedColumn}
          >
            <option value="name" className="text-base md:text-sm">
              Name
            </option>
            <option value="email" className="text-base md:text-sm">
              Email
            </option>
          </select>

          <Input
            placeholder={`Search by ${selectedColumn}`}
            onChange={(e) => {
              setSearchText(e.target.value);
              handleSearch();
            }}
            value={searchText}
            className="w-full md:w-64 px-4 py-2 border rounded-md md:mr-2 focus:outline-none focus:border-blue-500"
          />

          <button
            className="w-full my-2 md:my-0 md:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md sm:px-6 lg:px-8"
            onClick={handleSearch}
          >
            <SearchOutlined />
          </button>
        </div>
        <button
          className="w-full md:w-auto bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md sm:px-6 lg:px-8"
          onClick={handleDeleteAll}
        >
          <DeleteOutlined />
        </button>
      </div>

      <Modal
        title="Update User"
        open={isModalOpen}
        onOk={() => handleEdit()}
        onCancel={() => setIsModalOpen(false)}
        okButtonProps={{
          className: "bg-blue-500 hover:bg-blue-700 text-white",
        }}
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name:
          </label>
          <Input
            value={currRec?.name}
            onChange={(e) => setCurrRec({ ...currRec, name: e.target.value })}
            placeholder="Enter name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Role:
          </label>
          <select
            value={currRec?.role}
            onChange={(e) => setCurrRec({ ...currRec, role: e.target.value })}
            className="block w-full px-4 py-2 mt-1 leading-tight border rounded-md appearance-none bg-gray-100 focus:outline-none focus:bg-white"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </Modal>
      <div className="mx-5 my-5 ">
        {loading ? (
          <Loader />
        ) : (
          <>
            <p className="mx-5 my-4 text-sm text-gray-500  ">
              {`${selectedRowKeys.length} of ${data.length} row(s) selected`}
            </p>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredData || data}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
