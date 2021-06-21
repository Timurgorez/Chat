import io from 'socket.io-client';
import toast from 'react-hot-toast';


const socket = io();
socket.connect();

export default socket;