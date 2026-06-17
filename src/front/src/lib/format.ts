export const displayNumberWithMoneyFormat = (value: number) => {
	const stringValue = value != null && value !== undefined ? value.toString() : "";
	const tableValues = stringValue?.split("");

	const lastIndex = tableValues.length - 1;

	let finalValue = "";

	let i = lastIndex;
	let iteration = 0;

	while (i >= 0) {
		if (iteration === 3) {
			finalValue = " " + finalValue;
			iteration = 0;

			continue;
		}

		finalValue = tableValues[i] + finalValue;

		iteration += 1;
		i -= 1;
	}

	return finalValue;
};

export const displayDate = (date: Date | string | number) => {
	const dateObj = date instanceof Date ? date : new Date(date);
	return dateObj.toLocaleDateString("fr-FR", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

export const displayFullDateAndHour = (date: Date) => {
	return date.toLocaleDateString("fr-FR", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
	});
};

export const displayHour = (date: Date) => {
	return date.toLocaleTimeString("fr-FR", {
		hour: "numeric",
		minute: "numeric",
	});
};

export const formatDateYYYYMMDD = (date: Date) => {
	return date.toISOString().split("T")[0];
};

export const displayRelativeDate = (date: Date) => {
	const now = new Date();

	const diff = now.getTime() - date.getTime();

	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const weeks = Math.floor(days / 7);
	const months = Math.floor(weeks / 4);
	const years = Math.floor(months / 12);

	if (years) {
		return `${years} an${years > 1 ? "s" : ""}`;
	}

	if (months) {
		return `${months} mois`;
	}

	if (weeks) {
		return `${weeks} semaine${weeks > 1 ? "s" : ""}`;
	}

	if (days) {
		return `${days} jour${days > 1 ? "s" : ""}`;
	}

	if (hours) {
		return `${hours} heure${hours > 1 ? "s" : ""}`;
	}

	if (minutes) {
		return `${minutes} minute${minutes > 1 ? "s" : ""}`;
	}

	if (seconds) {
		return `${seconds} seconde${seconds > 1 ? "s" : ""}`;
	}

	return "Maintenant";
};

export const displayFileSize = (size: number) => {
	const units = ["B", "KB", "MB", "GB", "TB"];

	let i = 0;

	while (size >= 1000) {
		size /= 1000;
		i += 1;
	}

	return `${size.toFixed(2)} ${units[i]}`;
};

export const getInitials = (name: string) => {
	const names = name?.split(" ");

	return names
		?.slice(0, 2)
		.map((name) => name[0]?.toUpperCase())
		.join("");
};

export const upperCaseInitial = (name: string) => {
	const names = name?.split(" ");

	return names.map((name) => name[0].toUpperCase() + name.slice(1)).join(" ");
};

export const formatCreditCardNumber = (value: string) => {
	// remove all spaces
	const newValue = value.replace(/\s/g, "");

	const tableValues = newValue.split("");

	const lastIndex = tableValues.length - 1;

	let finalValue = "";

	let i = 0;

	while (i <= lastIndex) {
		if (i % 4 === 0 && i !== 0) {
			finalValue = finalValue + " ";
		}

		finalValue += tableValues[i];

		i += 1;
	}

	return finalValue;
};
