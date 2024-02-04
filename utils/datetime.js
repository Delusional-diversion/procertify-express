export function formatDate(date) {
    if (!(date instanceof Date)) {
        throw new Error("Invalid Date object");
    }

    const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return formattedDate;
}
