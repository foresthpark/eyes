// Crawlable intro text per gallery category - used on the page, in the meta
// description, and in the ImageGallery JSON-LD.
// TODO: rewrite in your own voice - this is placeholder copy.

export interface CategoryCopy {
	intro: string;
	metaDescription: string;
}

const copy: Record<string, CategoryCopy> = {
	film: {
		intro:
			"Photographs shot on film - Hasselblad 501CM, Nikon FM3A, and Pentax 645NII. Grain, patience, and one frame at a time, made in and around Vancouver.",
		metaDescription:
			"Film photography by Double Tree - medium format and 35mm work shot on Hasselblad, Nikon, and Pentax cameras in Vancouver, Canada.",
	},
	digital: {
		intro:
			"Digital work, mostly from a Fuji X100VI carried everywhere. Quieter moments, everyday light, and the scenes film would have missed.",
		metaDescription:
			"Digital photography by Double Tree - everyday scenes and quiet moments captured on a Fuji X100VI in Vancouver, Canada.",
	},
	portraits: {
		intro:
			"Portraits on film and digital - faces, gestures, and the stillness between them.",
		metaDescription:
			"Portrait photography by Double Tree - portraits shot on film and digital in Vancouver, Canada.",
	},
};

export function getCategoryCopy(slug: string, name: string): CategoryCopy {
	return (
		copy[slug] || {
			intro: `${name} photography - a collection of my view of the world, shot on film and digital.`,
			metaDescription: `${name} photography gallery by Double Tree - shot on film and digital in Vancouver, Canada.`,
		}
	);
}
