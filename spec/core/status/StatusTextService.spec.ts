import "reflect-metadata";
import { Duration } from "luxon";
import type { State } from "../../../src/core/state/State";
import {
    HAPPINESS_INITIAL,
    WATER_INITIAL,
} from "../../../src/core/state/State";
import { StatusService } from "../../../src/core/status/StatusService";
import type { StatusTextService } from "../../../src/core/status/StatusTextService";
import { container } from "../../../src/inversify.config";
import { TYPES } from "../../../src/types";

const createState = (): State => {
    return {
        bestLifetimeDuration: Duration.fromMillis(0),
        status: {
            water: WATER_INITIAL,
            happiness: HAPPINESS_INITIAL,
        },
        birth: {
            timestamp: new Date(),
            initiator: "none",
        },
        death: {
            timestamp: null,
            initiator: null,
            cause: null,
        },
    };
};

describe("StatusTextService", () => {
    let statusTextService: StatusTextService;

    let mockStatusService: StatusService;

    beforeEach(() => {
        container.snapshot();

        mockStatusService = new StatusService();
        container
            .rebind<StatusService>(TYPES.StatusService)
            .toConstantValue(mockStatusService);

        statusTextService = container.get<StatusTextService>(
            TYPES.StatusTextService
        );
    });
    afterEach(() => {
        container.restore();
    });

    describe("createStatusLabel", () => {
        it("returns 'is dead' when dead.", () => {
            spyOn(mockStatusService, "isAlive").and.returnValue(false);

            expect(statusTextService.createStatusLabel(createState())).toEqual(
                "is dead"
            );
        });
        it("returns 'doing great' when a high relative score is returned.", () => {
            spyOn(mockStatusService, "isAlive").and.returnValue(true);
            spyOn(mockStatusService, "calculateRelativeIndex").and.returnValue(
                0.75
            );

            expect(statusTextService.createStatusLabel(createState())).toEqual(
                "doing great"
            );
        });
        it("returns 'doing fine' when a medium relative score is returned.", () => {
            spyOn(mockStatusService, "isAlive").and.returnValue(true);
            spyOn(mockStatusService, "calculateRelativeIndex").and.returnValue(
                0.5
            );

            expect(statusTextService.createStatusLabel(createState())).toEqual(
                "doing fine"
            );
        });
        it("returns 'close to dying' when a low relative score is returned.", () => {
            spyOn(mockStatusService, "isAlive").and.returnValue(true);
            spyOn(mockStatusService, "calculateRelativeIndex").and.returnValue(
                0.25
            );

            expect(statusTextService.createStatusLabel(createState())).toEqual(
                "close to dying"
            );
        });
    });
});
