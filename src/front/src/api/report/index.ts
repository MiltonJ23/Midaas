import instance from "..";
import { GenerateReportDTO } from "./dto/generateReport.dto";
import { withErrorHandling } from "@/api/api-wrapper-utility";

export const reportProvider = {
    generateReport: async (payload: GenerateReportDTO) => {
        return await withErrorHandling<{ message: string; url: string }>(
            async () => {
                const response = await instance.post("/rapport/generate/", payload);

                if (response.status === 200 && response.data) {
                    return {
                        status: response.status,
                        data: {
                            message: "Le rapport a été généré avec succès",
                            url: response.data.file_url,
                        },
                    };
                }

                return response;
            },
            "Une erreur est survenue lors de la génération du rapport",
            "Le rapport a été généré avec succès"
        );
    },
};