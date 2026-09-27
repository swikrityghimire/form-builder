/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Upload, X, File as FileIcon } from "lucide-react";
import type { Field } from "@/types";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilePreview {
  file: File;
  url: string | null;
}

export function FileField({ field }: { field: Field }) {
  const { control } = useFormContext();
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<FilePreview[]>([]);

  // Determine if multiple is enabled (default TRUE for file/image fields)
  const isMultiple = field.multiple !== false;

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: rhf }) => {
        const files: File[] = rhf.value
          ? Array.from(rhf.value as FileList)
          : [];

        // Build previews when files change
        useEffect(() => {
          const newPreviews: FilePreview[] = files.map((file) => ({
            file,
            url: file.type.startsWith("image/")
              ? URL.createObjectURL(file)
              : null,
          }));
          setPreviews(newPreviews);

          return () => {
            newPreviews.forEach((p) => p.url && URL.revokeObjectURL(p.url));
          };
        }, [rhf.value]); // eslint-disable-line react-hooks/exhaustive-deps

        const updateFiles = (newFiles: File[]) => {
          const dt = new DataTransfer();
          newFiles.forEach((f) => dt.items.add(f));
          rhf.onChange(dt.files);
        };

        const handleAddFiles = (incoming: FileList | null) => {
          if (!incoming) return;
          const incomingArr = Array.from(incoming);

          if (isMultiple) {
            // Append to existing (avoid duplicates by name+size)
            const existing = new Set(
              files.map((f) => `${f.name}-${f.size}`)
            );
            const newOnes = incomingArr.filter(
              (f) => !existing.has(`${f.name}-${f.size}`)
            );
            updateFiles([...files, ...newOnes]);
          } else {
            updateFiles(incomingArr.slice(0, 1));
          }
        };

        const removeFile = (index: number) => {
          updateFiles(files.filter((_, i) => i !== index));
        };

        const clearAll = () => {
          updateFiles([]);
        };

        const isImageMode =
          field.type === "image" ||
          field.accept?.includes("image") ||
          false;

        const showDropZone = isMultiple || files.length === 0;

        return (
          <FormItem>
            <FormLabel className="flex items-center justify-between">
              <span>
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </span>
              {files.length > 0 && (
                <span className="text-xs text-muted-foreground font-normal">
                  {files.length} file{files.length !== 1 ? "s" : ""}
                  {isMultiple && " · can add more"}
                </span>
              )}
            </FormLabel>
            <FormControl>
              <div className="space-y-3">

                {showDropZone && (
                  <label
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                      handleAddFiles(e.dataTransfer.files);
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed cursor-pointer transition-colors",
                      dragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/30"
                    )}
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm font-medium">
                        {files.length > 0
                          ? "Add more files"
                          : "Click to upload"}{" "}
                        <span className="text-muted-foreground font-normal">
                          or drag and drop
                        </span>
                      </p>
                      {field.accept && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Accepted: {field.accept}
                        </p>
                      )}
                      {isMultiple && (
                        <p className="text-xs text-muted-foreground">
                          Multiple files allowed
                        </p>
                      )}
                    </div>
                    <input
                      type="file"
                      accept={field.accept}
                      multiple={isMultiple}
                      onChange={(e) => {
                        handleAddFiles(e.target.files);
                        e.target.value = "";
                      }}
                      className="hidden"
                      disabled={field.disabled}
                    />
                  </label>
                )}

                {files.length > 1 && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearAll}
                      className="text-destructive hover:text-destructive text-xs"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear all
                    </Button>
                  </div>
                )}

                {previews.length > 0 && (
                  <div
                    className={cn(
                      isImageMode && previews.some((p) => p.url)
                        ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
                        : "space-y-2"
                    )}
                  >
                    {previews.map((preview, idx) => {
                      if (preview.url) {
                        return (
                          <div
                            key={idx}
                            className="group relative aspect-square rounded-lg border overflow-hidden bg-muted"
                          >
                            <img
                              src={preview.url}
                              alt={preview.file.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                              <p className="text-xs text-white text-center line-clamp-2 font-medium">
                                {preview.file.name}
                              </p>
                              <p className="text-[10px] text-white/70">
                                {(preview.file.size / 1024).toFixed(0)} KB
                              </p>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => removeFile(idx)}
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2 rounded-md border bg-background"
                        >
                          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">
                            <FileIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {preview.file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(preview.file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive shrink-0"
                            onClick={() => removeFile(idx)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </FormControl>
            {field.description && (
              <FormDescription>{field.description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}