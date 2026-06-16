import mtn from "@/assets/images/icons/mtn.svg";
import orange from "@/assets/images/icons/orange.svg";
import mastercard from "@/assets/images/icons/mastercard.svg";
import visa from "@/assets/images/icons/visa.svg";
import cash from "@/assets/images/icons/cash.png";

// Create a proxy to handle any key access
export const paymentMethods = new Proxy(
  {
	mtn_money: {
	  name: "MTN",
	  icon: mtn,
	},
	orange_money: {
	  name: "Orange",
	  icon: orange,
	},
	mastercard: {
	  name: "Mastercard",
	  icon: mastercard,
	},
	virement: {
	  name: "Virement Bancaire",
	  icon: mastercard,
	},
	visa: {
	  name: "Visa",
	  icon: visa,
	},
	cash: {
	  name: "Cash",
	  icon: cash,
	},
  } as Record<string, { name: string; icon: any; }>,
  {
	get: (target, prop) => {
	  // If the property exists, return it
	  if (prop in target) {
		return target[prop.toString()];
	  }

	  // For any other string, return a default object
	  return {
		name: String(prop).startsWith("Autre: ")
		  ? String(prop).substring(6) // Remove "Autre: " prefix
		  : String(prop),
		icon: cash // Use cash icon as default
	  };
	}
  }
);

export const plans = {
	free_trial: {
		title: "Essai gratuit",
		price: "0",
		duration: "30 jours",
		description:
			"Collectez des paiements récurrents et ponctuels d’une manière simple.",
		features: [
			"Gestion des biens immobiliers",
			"Gestion des locataires",
			"Envoi automatique des rappels",
			"Collecte de loyers",
			"Stockage de documents",
			"Comptabilité et rapports d'analyse",
			"Génération de baux",
		],
	},
	monthly: {
		title: "Mensuel",
		price: "39.900",
		duration: "1 mois",
		description:
			"Collectez des paiements récurrents et ponctuels d’une manière simple.",
		features: [
			"Accès complet à toutes les fonctionnalités sans engagement",
			"Idéal pour tester la solution sur une courte période",
			"Envoi automatique de rappels par SMS et email en cas d’impayés",
			"Suivi simple des paiements récurrents et ponctuels",
			"Collecte des loyers via CinetPay disponible en option, avec frais supplémentaires",
		],
	},

	quarterly: {
		title: "Trimestre",
		price: "114.900",
		duration: "3 mois",
		description:
			"Collectez des paiements récurrents et ponctuels d’une manière simple.",
		features: [
			"Économies réalisées par rapport à un abonnement mensuel",
			"Gestion continue et optimisée sur 3 mois",
			"Accès à l’ensemble des fonctionnalités (rappels, suivi, rapports)",
			"Idéal pour les propriétaires souhaitant stabiliser leur gestion locative",
			"Option de collecte automatique des loyers via CinetPay, activable à tout moment",
			"Renouvellement simplifié pour une continuité sans interruption",
		],
	},

	semiannual: {
		title: "Semestre",
		price: "229.900",
		duration: "6 mois",
		description:
			"Collectez des paiements récurrents et ponctuels d’une manière simple.",
		features: [
			"La formule la plus économique sur la durée",
			"Gestion sereine et automatisée pendant 6 mois",
			"Accès illimité à tous les outils de gestion et de suivi",
			"Parfait pour les multi-propriétaires ou les gestionnaires professionnels",
			"Collecte en ligne des loyers via CinetPay disponible en option, avec frais applicables",
			"Gain de temps et réduction des tâches manuelles",
		],
	},
};
