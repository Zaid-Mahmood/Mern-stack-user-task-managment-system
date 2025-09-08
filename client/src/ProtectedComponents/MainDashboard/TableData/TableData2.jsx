import React, { useState, useEffect, useMemo } from 'react'
import { useGetApi } from "../../../customHooks/useGetApi";
import { useDeleteApi } from "../../../customHooks/useDeleteApi";
const TableData2 = ({ setTaskAndBtnStatusFlag, setInputVals, searchData, addAndUpdateData, debouncedValue }) => {
    const getUrl = `${import.meta.env.VITE_API_URL}get-all-tasks`;
    const deleteUrl = `${import.meta.env.VITE_API_URL}delete-task`;
    const [userData, setUserData] = useState([]);

    const { getData, getLoading, commonGetFunction } = useGetApi(getUrl);
    const { deleteRow, delloading, delError } = useDeleteApi(deleteUrl);

    const setTimeFormat = (date) => {
        const newDate = new Date(date);
        const year = newDate.getFullYear();
        const month = String(newDate.getMonth() + 1).padStart(2, '0');
        const day = String(newDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    };

    const editFunction = async (id) => {
        setTaskAndBtnStatusFlag({ addTaskFlag: false, btnStatus: false })
        const retriveEditFields = userData.find((item) => item?._id === id)
        setInputVals((prev) => ({ ...prev, _id: retriveEditFields._id, userTasks: retriveEditFields.userTasks, taskStatus: retriveEditFields.taskStatus, startDate: setTimeFormat(retriveEditFields.startDate), endDate: setTimeFormat(retriveEditFields.endDate) }))
    }

    const delTaskFunction = async (id) => {
        const data = await deleteRow({ id })
        setUserData(data.data?.tasks)
    }
    

    useEffect(() => {
        const fetchData = async () => {
            if (!debouncedValue) {
                const response = await commonGetFunction()
                setUserData(response.data?.userTasks || []);
                return;
            }
            if (searchData || debouncedValue) {
                setUserData(searchData?.data  || [])
                return;
            }
        }
        fetchData()
    }, [addAndUpdateData, debouncedValue])

    return (
        <div>
            <table className='mx-auto my-4 table-auto md:table-fixed'>
                <thead>
                    <tr>
                        <th>Sr No.</th>
                        <th>Task Title</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Task Status</th>
                        <th>Edit Task</th>
                        <th>Delete Task</th>
                    </tr>
                </thead>
                <tbody>
                    {userData?.map((item, id) => (
                        <tr key={id}>
                            <td>{id + 1}</td>
                            <td>{item.userTasks}</td>
                            <td>{setTimeFormat(item.startDate)}</td>
                            <td>{setTimeFormat(item.endDate)}</td>
                            <td>{item.taskStatus}</td>
                            <td><button className='cursor-pointer border-2 bg-green-500 border-green-500 rounded-full px-4 py-2' onClick={() => editFunction(item._id)}>Edit</button></td>
                            <td><button onClick={() => delTaskFunction(item._id)} className='cursor-pointer border-2 bg-red-500 border-red-500 rounded-full px-4 py-2'>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default React.memo(TableData2);
