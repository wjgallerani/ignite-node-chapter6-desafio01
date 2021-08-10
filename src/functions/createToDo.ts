import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidV4 } from "uuid";

import { document } from "../utils/dynamodbClient";

interface ICreateToDo {
    title: string;
    deadline: string;
}

interface ICreate {
    id: string;
    user_id: string;
    title: string;
    done: boolean;
    deadline: string;
}

export const handle: APIGatewayProxyHandler = async (event) => {
    const { user_id } = event.pathParameters;
    const { title, deadline } = JSON.parse(event.body) as ICreateToDo;

    const idV4 = uuidV4();

    const toDo: ICreate = {
        id: String(idV4),
        user_id,
        title,
        done: false,
        deadline: new Date(deadline).toISOString()
    }

    await document.put({
        TableName: "ToDos",
        Item: toDo
    }).promise();

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: "ToDo criado com sucesso!",
            todo: toDo,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }
}