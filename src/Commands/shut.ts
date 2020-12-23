export = {
  name: "shutdown",
  ownerOnly: true,
  callback: (message, args, bot) => {
    bot.destroy();
  },
};
