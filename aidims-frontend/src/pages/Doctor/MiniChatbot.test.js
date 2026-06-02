import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MiniChatbot from './MiniChatBot';

describe('MiniChatbot Component - DICOM and PNG Upload Validation', () => {
    let alertMock;

    beforeAll(() => {
        // Mock scrollIntoView which is not implemented in jsdom
        window.HTMLElement.prototype.scrollIntoView = jest.fn();

        // Mock URL.createObjectURL since it is not implemented in jsdom
        if (typeof window !== 'undefined') {
            window.URL.createObjectURL = jest.fn(() => 'mock-image-url');
        }
    });

    beforeEach(() => {
        // Mock alert to intercept error messages
        alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

        // Mock fetch to avoid real API calls
        global.fetch = jest.fn().mockImplementation((url) => {
            if (url.includes('/health')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve("running"),
                });
            }
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: "Mocked chatbot response" }),
            });
        });
    });

    afterEach(() => {
        alertMock.mockRestore();
        jest.clearAllMocks();
    });

    const openChatbot = (container) => {
        const chatIcon = container.querySelector('.chat-icon');
        expect(chatIcon).toBeInTheDocument();
        fireEvent.click(chatIcon);
    };

    test('should open chatbot and display welcome message', () => {
        const { container } = render(<MiniChatbot />);
        openChatbot(container);
        expect(screen.getByText(/Xin chào! Tôi là trợ lý AI/)).toBeInTheDocument();
    });

    test('should upload a normal PNG image successfully', async () => {
        const { container } = render(<MiniChatbot />);
        openChatbot(container);

        // Find the image file input
        const imageInput = container.querySelector('input[accept="image/*"]');
        expect(imageInput).toBeInTheDocument();

        // Create a mock PNG file
        const pngFile = new File(['png-content'], 'test_image.png', { type: 'image/png' });

        // Simulate file selection
        fireEvent.change(imageInput, { target: { files: [pngFile] } });

        // Verify that no alert was triggered
        expect(alertMock).not.toHaveBeenCalled();

        // Verify that the image is added to selected images preview
        await waitFor(() => {
            expect(screen.getByText(/Hình ảnh đã chọn/)).toBeInTheDocument();
            expect(screen.getByText(/test_image.png/)).toBeInTheDocument();
        });
    });

    test('should upload a valid DICOM (.dcm) file successfully', async () => {
        const { container } = render(<MiniChatbot />);
        openChatbot(container);

        // Find the DICOM file input
        const dicomInput = container.querySelector('input[accept=".dcm"]');
        expect(dicomInput).toBeInTheDocument();

        // Create a mock DICOM file
        const dicomFile = new File(['dicom-content'], 'patient_scan.dcm', { type: 'application/dicom' });

        // Simulate file selection
        fireEvent.change(dicomInput, { target: { files: [dicomFile] } });

        // Verify that no alert was triggered
        expect(alertMock).not.toHaveBeenCalled();

        // Verify that the chat displays the DICOM file selection message
        await waitFor(() => {
            expect(screen.getByText(/Đã chọn file DICOM:/)).toBeInTheDocument();
            expect(screen.getByText(/patient_scan.dcm/)).toBeInTheDocument();
        });
    });

    test('should fail and show alert when uploading an invalid file to the DICOM input', async () => {
        const { container } = render(<MiniChatbot />);
        openChatbot(container);

        const dicomInput = container.querySelector('input[accept=".dcm"]');
        expect(dicomInput).toBeInTheDocument();

        // Create a mock PNG file to feed into DICOM input
        const invalidFile = new File(['png-content'], 'wrong_format.png', { type: 'image/png' });

        // Simulate file selection
        fireEvent.change(dicomInput, { target: { files: [invalidFile] } });

        // Verify that alert was triggered with correct message
        expect(alertMock).toHaveBeenCalledWith('Chỉ chấp nhận file DICOM (.dcm)');

        // Verify that no DICOM selection message is added to screen
        expect(screen.queryByText(/Đã chọn file DICOM:/)).not.toBeInTheDocument();
    });
});
