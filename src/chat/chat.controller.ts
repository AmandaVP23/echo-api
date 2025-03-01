// chat.controller.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SendMessageRequest, SendMessageResponse, AcceptMessageRequest, AcceptMessageResponse } from '../chat'; // Import the protobuf types

@Controller('chat')
export class ChatController {
  // Handle the SendMessage gRPC call
  @GrpcMethod('ChatService', 'SendMessage')
  sendMessage(request: SendMessageRequest): SendMessageResponse {
    console.log('Received SendMessage request:', request);
    return {
      status: 'PENDING', // Example response status
      requestId: 'req_123', // Example request ID
    };
  }

  // Handle the AcceptMessageRequest gRPC call
  @GrpcMethod('ChatService', 'AcceptMessageRequest')
  acceptMessageRequest(request: AcceptMessageRequest): AcceptMessageResponse {
    console.log('Received AcceptMessageRequest:', request);
    return {
      status: 'ACCEPTED', // Example response status
    };
  }

  // You can also handle HTTP requests here, if needed
  // @Post('send-message') 
  // sendMessageViaHttp(@Body() body: SendMessageRequest) {
  //   return this.chatService.sendMessageViaGrpc(body); // For example
  // }
}
