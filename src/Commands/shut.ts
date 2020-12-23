export = {
  name: "shutdown",
  ownerOnly: true,
  category: "Dev",
  description: "Shuts down the bot",
  callback: (message, args, bot) => {
    process.exit();
  },
};
