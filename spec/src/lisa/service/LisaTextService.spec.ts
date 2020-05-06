import "reflect-metadata";
import { duration } from "moment";
import {
    HAPPINESS_INITIAL,
    LisaState,
    WATER_INITIAL,
} from "../../../../src/lisa/LisaState";
import { LisaStatusService } from "../../../../src/lisa/service/LisaStatusService";
import { LisaTextService } from "../../../../src/lisa/service/LisaTextService";
import { container } from "../../../../src/inversify.config";
import { TYPES } from "../../../../src/types";

const createState = (): LisaState => {
    return {
        bestLifetime: duration(0),
        status: {
            water: WATER_INITIAL,
            happiness: HAPPINESS_INITIAL,
        },
        life: {
            time: new Date(),
            byUser: "none",
        },
        death: {
            time: null,
            byUser: null,
            cause: null,
        },
    };
};

describe("LisaTextService", () => {
    let lisaTextService: LisaTextService;

    let mockLisaStatusService: LisaStatusService;

    beforeEach(() => {
        container.snapshot();

        mockLisaStatusService = new LisaStatusService();
        container
            .rebind<LisaStatusService>(TYPES.LisaStatusService)
            .toConstantValue(mockLisaStatusService);

        lisaTextService = container.get<LisaTextService>(TYPES.LisaTextService);
    });
    afterEach(() => {
        container.restore();
    });

    describe("createStatusLabel", () => {
        it("returns 'is dead' when dead.", () => {
            spyOn(mockLisaStatusService, "isAlive").and.returnValue(false);

            expect(lisaTextService.createStatusLabel(createState())).toEqual(
                "is dead"
            );
        });
        it("returns 'doing great' when a high relative score is returned.", () => {
            spyOn(mockLisaStatusService, "isAlive").and.returnValue(true);
            spyOn(
                mockLisaStatusService,
                "calculateRelativeIndex"
            ).and.returnValue(0.75);

            expect(lisaTextService.createStatusLabel(createState())).toEqual(
                "doing great"
            );
        });
        it("returns 'doing fine' when a medium relative score is returned.", () => {
            spyOn(mockLisaStatusService, "isAlive").and.returnValue(true);
            spyOn(
                mockLisaStatusService,
                "calculateRelativeIndex"
            ).and.returnValue(0.5);

            expect(lisaTextService.createStatusLabel(createState())).toEqual(
                "doing fine"
            );
        });
        it("returns 'close to dying' when a low relative score is returned.", () => {
            spyOn(mockLisaStatusService, "isAlive").and.returnValue(true);
            spyOn(
                mockLisaStatusService,
                "calculateRelativeIndex"
            ).and.returnValue(0.25);

            expect(lisaTextService.createStatusLabel(createState())).toEqual(
                "close to dying"
            );
        });
    });
});
