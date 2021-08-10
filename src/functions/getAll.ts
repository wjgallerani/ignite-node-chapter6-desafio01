import { APIGatewayProxyHandler } from "aws-lambda";

import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
    const { user_id } = event.pathParameters;

    const response = await document.query({
        TableName: "ToDos",
        KeyConditionExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
            ":user_id": user_id,
        },
    }).promise();

    const toDos = response.Items;

    if (!toDos) {
        return {
            statusCode: 204,
            body: JSON.stringify({
                error: "Sem Conteudo",
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Sucesso",
            todo: toDos,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }
}