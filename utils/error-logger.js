export const logError = (e, res) => {
    console.error(e);
    res.status(500).json({
        success: false,
        message: !process.env.PRODUCTION
            ? e.message
            : "An error was encountered, check your request and try again",
    });
};
